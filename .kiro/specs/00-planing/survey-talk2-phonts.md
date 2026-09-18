# 調査: 現行アプリの古い talk2 phont は新評価版で使えるか

taku-o 向け。実装も製品コミットもしていない。SDK バイナリと phont は git / Project store にコピーしていない。

観測日: 2026-09-18。ホスト: arm64。

対象: `aq_defo1` / `aq_momo1` / `aq_teto1`

## 判定

**3つとも works。** 新評価版 `libAquesTalk2Eva.dylib` の `AquesTalk2_Synthe_Utf8` で、公式同梱 phont と同じ呼び方で WAV が出る。error でも silent fail でもない。

公式評価版パッケージには、もともと入っていない。現行アプリが後から足したもの。コピーすれば使える。

## 一目で

| phont | 公式評価版 | 現行アプリ | 新評価版 Synthe |
| --- | --- | --- | --- |
| `aq_f1c`（対照） | ある | ある | **works** |
| `aq_defo1` | 無い | ある | **works** |
| `aq_momo1` | 無い | ある | **works** |
| `aq_teto1` | 無い | ある | **works** |

## 出所（git）

ユーザーの見立てどおり、**後から足した**。公式 Mac SDK 由来ではない。

- 公式 Mac 評価版（旧 `vendor/aqtk2-mac-eva/phont/` も、新 2.4.1 の `AquesTalk2/phont/` も）は **14 種だけ**
- アプリ: `11c5041`（2016-12-30）`add 3 phont.` / リリースノート「phontを3つ追加」。当時のパスは公式が `vendor/aqtk2-mac/phont/`、この3つだけ `vendor/phont/`
- vendor: `0d0fe2c`（2017-01-04）`replace library.` で `vendor/phont/` に 14+3 をまとめた。これが現履歴でこの3ファイルが初めて出るコミット
- ファイル先頭は公式と同じ `Copyright 2009 AQUEST corp.`。自作ヘッダではない。公式 Mac パッケージの外から、プロジェクトが足した AQUEST 形式

## 試験（`/tmp` のみ）

評価版へコピーした（git には入れない）:

- 元: `/Users/taku-o/Desktop/myukkurivoice/vendor/phont/{aq_defo1,aq_momo1,aq_teto1}.phont`
- 先: `/Users/taku-o/Desktop/myukkurivoice-lib/AquesTalk2/phont/`（公式 14 種と同じフォルダ）

呼び方は現行アプリと同じ:

- dylib: `libAquesTalk2Eva.dylib`（arm64）
- API: `AquesTalk2_Synthe_Utf8(koe, speed, &size, phontDat)`
- koe: `こんにちわ`（評価制限のナ行・マ行を避ける）
- speed: 100
- phont: ファイル全体をメモリに載せて渡す（対照の `aq_f1c` と同じ）

| 対象 | Synthe | WAV | 判定 |
| --- | --- | --- | --- |
| `aq_f1c`（対照） | 非 NULL `size=12676` | 8kHz / 16bit / mono、`maxabs=32767` `rms=8538` | works |
| `aq_defo1` | 非 NULL `size=11968` | 同じ形式、`maxabs=25812` `rms=7138` | works |
| `aq_momo1` | 非 NULL `size=11550` | 同じ形式、`maxabs=20385` `rms=6038` | works |
| `aq_teto1` | 非 NULL `size=10940` | 同じ形式、`maxabs=24027` `rms=5017` | works |

error = `Synthe` が NULL（`size` がエラーコード。phont 不正は 1000–1008）。
silent fail = 非 NULL だが RIFF でない、data が空、PCM が全部 0。今回はどれも該当しない。

WAV は `/tmp/talk2-*.wav` にだけ書いた。store / git には入れていない。

## 計画への意味

- 新評価版に公式 14 種しか無くても、現行の 3 つは **同じ phont フォルダにコピーして使える**
- 製品判断（配布物に残すか）は、この試験では決めていない
- 評価版パッケージ自体には、今も入っていない

## やっていないこと

- 本体アプリからの再生確認
- git への phont コミット
- SDK / phont の store コピー
- `requirements.md` / `design.md` / `tasks.md` / `spec.json`
