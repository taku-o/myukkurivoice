# 調査: Mac AT1 は iOS bridge を置き換えられるか

taku-o 向け。実装も製品コミットもしていない。SDK バイナリは git / Project store にコピーしていない。

観測日: 2026-09-18。ホスト: arm64（Darwin 27.0.0）。

## 判定

**要作業（needs work）。**

- **SDK としては足りる。** iOS は今は不要。取らない。
- **現行の `maquestalk1` とアプリの talk1 経路は、そのままでは Mac AT1 評価版を呼べない。**
- 「足りない」ではない。iOS に戻す理由は、今は無い。

## taku-o の決定

AquesTalk1 iOS は、AquesTalk1 Mac（i386）が動かなかったときの回避策。

新版は **可能なら Mac AT1**。iOS SDK は、Mac AT1 が足りないと証明されたときだけ。

## 一目で

| 項目 | 現行 | Mac AT1 評価版 | 結果 |
| --- | --- | --- | --- |
| 形式 | `AquesTalk.framework` | 声種ごとの **dylib**。`.framework` 無し | 差し替えが要る |
| arch | CLI は **i386**。iOS CLI は **x86_64** | **arm64 のみ** | 新版向き |
| 合成 API | `AquesTalk_SyntheMV(idVoice, sjis, speed, size)` | `AquesTalk_Synthe_Utf8(koe, speed, size)` | SyntheMV は無い |
| 声種 | 1 本の framework + `VOICE=0/1` | `libAquesTalk1-f1.dylib` / `-m1.dylib` を選ぶ | 切替方法が変わる |
| 文字 | CLI が UTF-8 → SJIS | UTF-8 専用 | SJIS 変換は不要 |
| 波形 | 8kHz / 16bit / mono / WAV | 同じ（実測済み） | 一致 |
| 解放 | ヘッダに `FreeWave`。現行 CLI は未呼び出し | `AquesTalk_FreeWave` あり | 新 CLI では呼ぶ |
| キー | 現行 Mac CLI は未設定 | `SetDevKey` / `SetUsrKey` | 評価制限の解除用。後段 |

アプリが今使う talk1 は **f1 と m1 だけ**。評価版に両方ある。iOS 経路では m1 が消えていた。Mac AT1 の方が現行機能を覆う。

## 現行パス（置き換え対象）

### `maquestalk1`（Desktop checkout, `master`）

- `main.m`: stdin → SJIS → `AquesTalk_SyntheMV` → stdout WAV
- 声種: 環境変数 `VOICE`（int）。速度: `SPEED`
- Xcode: `ARCHS_STANDARD_32_BIT`。Deployment 10.11
- 同梱は古い `AquesTalk.framework`（ヘッダ `AquesTalkF.h`）

### 本体アプリ `js/service.aques.ts`

- Catalina 未満 → `vendor/maquestalk1`（i386）
- Catalina 以降 / MAS → `vendor/maquestalk1-ios`（x86_64）
- 呼び出し: `cat 一時ファイル | VOICE=… SPEED=… <cmd>`
- m1 は `catalina:false`。iOS 経路では出さない

### vendor 実体（現行配布）

- `vendor/maquestalk1`: Mach-O **i386**
- `vendor/maquestalk1-ios`: Mach-O **x86_64**
- `vendor/AquesTalk.framework`: **i386 + ppc**

Apple Silicon では、現行コードは必ず iOS CLI 側に落ちる。それが回避策だった。

## 評価版 Mac AT1

パス: `/Users/taku-o/Desktop/myukkurivoice-lib/AquesTalk1/`

- ヘッダ: `AquesTalk1-mac.h`
- 声種 9: `f1` `f2` `f3` `m1` `m2` `r1` `dvd` `imd1` `jgr`
- 公開シンボル（`nm -gU`、f1 / m1 とも）:
  - `AquesTalk_Synthe_Utf8`
  - `AquesTalk_FreeWave`
  - `AquesTalk_SetDevKey`
  - `AquesTalk_SetUsrKey`
- **無い:** `AquesTalk_SyntheMV` / `AquesTalk_Synthe`（SJIS）/ `.framework`
- install_name: `@rpath/libAquesTalk1-XX.dylib`
- 評価制限: キー無しだとナ行・マ行が「ヌ」。製品キーは後段

公式サンプル `samples/AqTkCmd` は、すでに `Synthe_Utf8` + `libAquesTalk1-f1.dylib`（Runpath `@executable_path`）。

## リンク試験（`/tmp` のみ。リポジトリは未変更）

ホスト clang 21、`-arch arm64`。dylib は評価版の場所を rpath 指定。コピーしていない。

| 試験 | 結果 |
| --- | --- |
| `probe.c` × `libAquesTalk1-f1.dylib` | リンク成功。実行 exit 0。WAV `size=12676` `rate=8000` `bits=16` `ch=1` |
| 同じソース × `libAquesTalk1-m1.dylib` | 同上 |
| `AquesTalk_SyntheMV` を同じ f1 dylib にリンク | **失敗**（`_AquesTalk_SyntheMV` undefined） |

入力 koe は `こんにちわ`（評価制限のナ行・マ行を避ける）。`SetDevKey` は未使用。

現行 `maquestalk1/main.m` を評価版にそのまま向けても、SyntheMV が無いのでリンクできない。

## アプリ側で後から直すこと（実装はしていない）

機能追加ではない。現行 talk1 を Mac AT1 で成立させるための差分。

1. `maquestalk1` を arm64 にし、`AquesTalk1-mac.h` + 声種 dylib をリンクする
2. `SyntheMV` をやめ、`AquesTalk_Synthe_Utf8` + `FreeWave` にする
3. 声種は dylib 選択（`VOICE=0` → f1、`VOICE=1` → m1）。1 プロセス 1 dylib で足りる
4. SJIS 変換をやめる（入力はもう UTF-8）
5. 本体の Catalina / iOS 切替を、Apple Silicon では Mac CLI 固定にする
6. m1 を iOS 制約で隠しているなら、Mac AT1 では戻せる
7. Runpath（`@rpath`）を CLI に合わせる
8. `SetDevKey` は評価制限解除用。有償キーは評価版で足りないと分かってから

## iOS

**今は戻さない。入手もしない。**

戻す条件: Mac AT1 評価版で、現行 talk1（f1 / m1、速度、8kHz WAV）が成立しないと証明されたとき。

今回のリンク試験では、その条件は出ていない。

## やっていないこと

- `maquestalk1` リポジトリの書き換え・製品ビルド
- 本体 `service.aques.ts` の変更
- iOS SDK の入手
- SDK バイナリのコピー（git / store）
- `requirements.md` / `design.md` / `tasks.md` / `spec.json`
- 製品コミット / push
