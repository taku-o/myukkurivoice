# 調査: AquesTalk1 を AT2 / AT10 と同じ直呼びにできるか

taku-o 向け。実装も製品コミットもしていない。SDK バイナリは git / Project store にコピーしていない。

観測日: 2026-09-19。ホスト: arm64。ホスト Node v24.7.0 + koffi 3.3.0。Electron renderer の中ではない。

作業順の正本: [upcoming-work.md](./upcoming-work.md)  
前の talk1 リンク試験: [survey-maquestalk1.md](./survey-maquestalk1.md)（CLI を直す前提だった。この調査で前提を変える）

## 判定

**直呼びできる。Yes。**

新しい Apple Silicon 版では、`maquestalk1` も `maquestalk1-ios` も **要らない。**

CLI を新 API 向けに書き直す必要は無い。AT1 は AT2 / AT10 と同じく、評価版 dylib を koffi で `Synthe_Utf8` → コピー → `FreeWave` すれば足りる。

## 一目で

| 質問 | 答え |
| --- | --- |
| AT1 を AT2 / AT10 と同じ直呼びにできる？ | **できる** |
| `maquestalk1` は新版で要る？ | **要らない** |
| `maquestalk1-ios` は要る？ | **要らない**（前から最後の手段） |
| いま止まっている理由は？ | 昔の AT1 が **i386** で、64bit の Electron から `dlopen` できなかった |
| 新 SDK でその理由は残る？ | **残らない。** arm64 dylib。UTF-8 専用 |

## なぜ CLI があったか

2017-03（v0.3.0、PR #6）から、AT1 だけ外部コマンド。AT2 は同じファイルで `ffi.DynamicLibrary`。最初から直呼びしていなかった。

理由はコードとバイナリで分かる:

- 現行 `vendor/AquesTalk.framework` は **i386 + ppc**
- 現行 `vendor/maquestalk1` は **i386 実行ファイル**
- Electron / Node は当時から **64bit**
- 64bit プロセスは 32bit の framework を `dlopen` できない
- だから i386 の小さな CLI を別プロセスで起動していた

Catalina 以降は i386 自体が死ぬ。それが `maquestalk1-ios`（x86_64）への切替。iOS は Mac AT1 が動かないときの回避策。releases 0.12.0 に書いてある。

新 Mac AT1 評価版は **arm64 の dylib**。この制約は消えた。

現行アプリの呼び分け（`js/service.aques.ts`）:

| エンジン | 今どう呼ぶか |
| --- | --- |
| AT1 | 一時ファイル → `cat \| VOICE=… SPEED=… maquestalk1` |
| AT2 | `ffi-napi` で `AquesTalk2_Synthe_Utf8(koe, speed, size, phont)` → `FreeWave` |
| AT10 | `ffi-napi` で `AquesTalk_Synthe_Utf8(AQTK_VOICE, koe, size)` → `FreeWave`。キーあり |

## 呼び出し形（ヘッダ）

同じ「koe を渡して WAV ポインタをもらい、あとで FreeWave」。違うのは声種の渡し方だけ。

| | AT1 新 | AT2 | AT10 |
| --- | --- | --- | --- |
| Synthe | `AquesTalk_Synthe_Utf8(koe, speed, pSize)` | `AquesTalk2_Synthe_Utf8(koe, speed, pSize, phontDat)` | `AquesTalk_Synthe_Utf8(pParam, koe, pSize)` |
| 解放 | `AquesTalk_FreeWave` | `AquesTalk2_FreeWave` | `AquesTalk_FreeWave` |
| 声種 | **dylib を選ぶ**（`libAquesTalk1-f1.dylib` / `-m1.dylib`） | phont ファイル | `AQTK_VOICE` 構造体 |
| 文字 | UTF-8 | UTF-8 | UTF-8 |
| キー | `SetDevKey` / `SetUsrKey` | **無い**（評価版 dylib 自体） | `SetDevKey` / `SetUsrKey` |
| WAV | 8kHz / 16bit / mono | 8kHz / 16bit / mono | 16kHz（`fsc` で変化） |

旧 AT1 の `AquesTalk_SyntheMV(idVoice, sjis, speed, size)` は新 dylib に **無い。** 声種 ID の引数も SJIS も無い。

アプリが今使う talk1 は **f1 と m1 だけ**（`idVoice` 0 / 1）。評価版に両方ある。

## 実測（`/tmp` のみ。リポジトリは未変更）

場所: `/tmp/applecpu-now-survey/koffi-probe/at1-direct-probe.js`  
入力 koe: `こんにちわ`（評価制限のナ行・マ行を避ける）。speed 100。`SetDevKey` なし。

前の [survey-small-pass.md](./survey-small-pass.md) の AT1 f1 を再利用し、同じプロセスで m1 を足した。

| 呼び出し | 結果 |
| --- | --- |
| AT1 f1 `Synthe_Utf8` + `FreeWave` | WAV。8kHz / 16bit / mono。`size=12676` `maxabs=32216` `rms=8226`。前の f1 と一致 |
| AT1 m1 同じ関数 | WAV。同じフォーマット。`size=12676` `maxabs=21615` `rms=3838`。f1 と波形が違う |
| 同じプロセスで f1 → m1 → もう一度 f1 | f1 の 2 回目も `maxabs=32216` `rms=8226`。記号が混ざらない |
| ダミー `SetDevKey` / `SetUsrKey` | 戻り `1`（不正キー。制限は残る。呼び出し自体は通る） |
| 壊れた koe `@@@` | Synthe NULL。`pSize=105`（現行 AT2 の errorTable 105 と同じ系統） |
| AT2 `aq_f1c` 対照 | 8kHz。`size=12676` |
| AT10 F1 `fsc=100` 対照 | **16kHz**。`size=25148` |

koffi はデフォルト `RTLD_LOCAL`。f1 と m1 は同じ関数名（`AquesTalk_Synthe_Utf8`）を出すが、ハンドルを分けて読めば衝突しない。

koffi の注意は前と同じ。戻りを `uint8 *` にすると先頭が壊れる。`void *` + `koffi.decode` なら RIFF が取れる。

WAV と JSON は `/tmp/applecpu-now-survey/` にだけ書いた。store / git には入れてない。

## AT2 / AT10 に対して残る差（直呼びを止めない）

直呼びできない、ではない。実装時に拾う差。

1. **声種は dylib 選択。** AT2 の phont、AT10 の構造体とは違う。`VOICE=0/1` は捨てて、`f1` / `m1` のパスを選ぶ
2. **同じプロセスに 2 本ロードする。** 今回は通った。実装は koffi のデフォルト（`RTLD_LOCAL`）を維持する。`global: true` にしてはいけない
3. **`FreeWave` は必須。** 今の CLI はプロセス終了任せで呼んでいない。Electron の中で直呼びするなら AT2 / AT10 と同じくコピーしてから解放する
4. **SJIS 変換は不要。** CLI の UTF-8 → SJIS は捨てる
5. **AT1 にもキー API がある。** 現行アプリは AT1 にキーを渡していない（CLI にその経路が無い）。AT10 と同じ関数名。有償キーは評価版で足りないと分かってから
6. **エラー表。** 現行 AT1 は CLI の終了コードを **AT2 の errorTable** に入れている。`@@@` は 105。AT1 専用表はヘッダに無い
7. **本番 renderer。** この試験はホスト Node。Electron 内の koffi は AT2 / AT10 と同じく LATER / THEN
8. **vendor には AT1 の f1 / m1 dylib が要る。** 要らないのは CLI であって、ライブラリ本体ではない
9. **`@rpath`。** 絶対パスで `koffi.load` すれば今は読める。配布時の配置は vendor 作業

## `maquestalk1` はどうするか

新版（arm64 専用）:

- **`maquestalk1` は捨てる / 置き換える。** 直さない
- **`maquestalk1-ios` は使わない。** Mac AT1 直呼びが足りないと証明されたときだけ戻す。今回その条件は出ていない

THEN 2 は「CLI を新 API で書き直す」ではない。「talk1 を koffi 直呼びに載せ、CLI を外す」。THEN 1 は vendor ファイル投入（先に置く）。

## やっていないこと

- `maquestalk1` / アプリの書き換え
- Electron renderer の中での呼び出し
- 有償キーでの制限解除
- SDK バイナリのコピー（git / store）
- `requirements.md` / `design.md` / `tasks.md` / `spec.json`
- 製品コミット / push
