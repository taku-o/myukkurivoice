# 調査: AqKanji2Koe Convert スニペット

taku-o 向け。観測日: 2026-09-18。ホスト: arm64。実装も製品コミットもしていない。SDK バイナリは git / Project store にコピーしていない。

判定の正本は下の「判定」。作業順の正本は [upcoming-work.md](./upcoming-work.md)。

## 判定

**works。** 評価版 `libAqKanji2Koe.dylib`（AqKanji2Koe-A Mac 4.1.1、arm64）をホスト Node + koffi 3.3.0 で呼び、`Create` → `Convert` → `Release` が通る。戻りは 0。koe は空でも壊れてもいない。

評価制限どおり、ナ行・マ行は「ヌ」になる（`SetDevKey` なし）。これは失敗ではない。

ホスト Node（v24.7.0）。Electron renderer の中ではない。本番アプリ経路は LATER / THEN。

## 一目で

| 項目 | 結果 |
| --- | --- |
| `AqKanji2Koe_Create`（評価版 `aq_dic`） | ハンドル非 NULL。`pErr=0` |
| `AqKanji2Koe_Convert` | `rc=0`。UTF-8 の音声記号列 |
| `AqKanji2Koe_Release` | 呼んだ |
| `AqKanji2Koe_ConvRoman` | 増えた API。呼める |
| `AqKanji2Koe_ConvertW` | 新 dylib に **無い**（現行 vendor にはある。アプリは未使用） |
| 製品名 | フォルダは `AqKanji2Koe/`。製品は **AqKanji2Koe-A** |
| 形式 | 現行 `.framework`（x86_64）→ 評価版 **dylib**（arm64 のみ） |
| 辞書ディレクトリ | 現行 `vendor/aq_dic_large` → 評価版 `aq_dic` |
| 辞書ファイル名 | どちらも `aqdic.bin` + `aq_user.dic`。リネームは無い |
| 辞書の中身 | サイズ・ハッシュが違う。読みも一部違う。形式は同じ系統で、評価版 dylib が現行辞書も読める |

## 試験（`/tmp` のみ）

場所: `/tmp/applecpu-now-survey/koffi-probe/aqkanji2koe-probe.js`  
koffi **3.3.0**。既存 Synthe プローブと同じ置き場。

- dylib: `/Users/taku-o/Desktop/myukkurivoice-lib/AqKanji2Koe/lib/libAqKanji2Koe.dylib`
- 辞書: 同梱 `aq_dic/`（末尾 `/` あり・なし、どちらも Create できる）
- `SetDevKey` なし（ダミーキーは戻り `1`）
- koe バッファは呼び出し側で確保。`void *` で渡して `koffi.decode(..., 'uint8_t', n)`。Synthe の「戻りを `uint8 *` にすると先頭が壊れる」問題の回避と同じ流儀

| 入力 | Convert `rc` | koe（評価制限込み） |
| --- | --- | --- |
| `こんにちわ` | 0 | `コンヌチワ'`（「に」→「ヌ」） |
| `音声合成テスト` | 0 | `オンセーゴーセーテ'_スト。` |
| `なまえ` | 0 | `ヌヌエ` |
| `まほう` | 0 | `ヌホー` |

`ConvRoman("こんにちわ")` → `konnnuchiwa'`（ここでも「ヌ」が出る）。

silent fail（`rc=0` なのに koe が空 / 非 UTF-8）ではない。

JSON ログは `/tmp/applecpu-now-survey/aqkanji2koe-probe.json` だけ。store / git には入れてない。

## API 差分（現行 vendor vs 評価版）

現行アプリが読むもの: `vendor/AqKanji2Koe.framework`（ヘッダは Linux Ver.3 表記、`ConvertW` あり）。アプリ本体（`js/service.aques.ts`）が呼ぶのは `Create` / `Convert` / `Release` / `SetDevKey` だけ。`ConvertW` はアプリから呼んでいない。

| 関数 | 現行 vendor | 評価版 AqKanji2Koe-A 4.1.1 | アプリ今 |
| --- | --- | --- | --- |
| `Create` / `Create_Ptr` / `Release` | ある | ある。引数同じ | `Create` / `Release` を使用 |
| `Convert` | UTF-8。`char *koe` + `nBufKoe` | 同じ | 使用。シグネチャはそのまま使える |
| `ConvertW`（UTF-32） | ある（nm でも見える） | **ヘッダにも dylib にも無い** | 未使用 |
| `ConvRoman` | 無い | **増えた**（ローマ字 koe） | 未使用 |
| `SetDevKey` | ある | ある | 使用 |
| バイナリ | `AqKanji2Koe.framework` x86_64 | `libAqKanji2Koe.dylib` arm64。install_name は `@rpath/libAqKanji2Koe.dylib` | framework パス |

AqUsrDic は同梱。関数名は `Import` / `Export` / `Check` / `GetLastError` で現行と同じ。評価版ヘッダに `STD_CALL` は無い。今回の主対象は Convert なので、Import の単語追加まではしていない。Export は辞書中身の比較のため `/tmp` でだけ呼んだ（下）。

エラーコード表（100 / 101 / 104–107 / 200 番台辞書 / 300 番台ユーザ辞書）は現行 `errorTable` と同じ。

## 辞書差分

ファイル名とマジックは同じ。中身のサイズと単語は違う。**パス名は `aq_dic_large` → `aq_dic`。**

| 辞書 | `aqdic.bin` | SHA-256（先頭 16 hex） | `aq_user.dic` | ユーザ辞書ヘッダ |
| --- | --- | --- | --- | --- |
| 評価版 `AqKanji2Koe/aq_dic` | 9,847,992 | `829ee0ead4423163` | 4,636 | `AqK2K Ver.3 user dic` |
| 現行 `vendor/aq_dic_large` | 12,773,560 | `ce73237455c8b18c` | 4,536 | 同じ Ver.3 文字列 |
| 現行 `vendor/aqk2k_mac/aq_dic` | 7,521,360 | `291ced5a9f5a16c5` | 4,536 | 同じ Ver.3 文字列 |

3 つの `aqdic.bin` 先頭はどれも `UNKD` / `UNK1`。形式の世代が別物、ではない。

評価版 dylib に現行ディレクトリを渡しても、Create + Convert は通る。

読みは辞書セットで変わる（同じ入力、評価制限はどれも同じ）:

| 入力 | 評価版 sys+user | 現行 large sys+user |
| --- | --- | --- |
| `音声合成テスト` | `オンセーゴーセーテ'_スト。` | `オンセイゴーセーテ'_スト。` |
| `忖度`（large のユーザ辞書にある） | `ソンタク` | `ソ'ンタク` |
| `博麗霊夢`（評価版ユーザ辞書にある） | `ハクレイレ'イヌ` | `ハクレーレ'イヌ。` |

マニュアルは「ユーザ辞書は作ったときのシステム辞書に依存。サイズの違うシステム辞書とは使えない」。今回の混在 `Create_Ptr` ではエラー 300 は出ず、単語によってはユーザ辞書が効いた。だから「混在しても必ず落ちる」ではない。ただし読みが変わるので、**差し替えは評価版の `aq_dic` 一式で揃える**のが安全。現行 `aq_dic_large` をそのまま製品辞書にする判断は、このスニペットではしていない。

ユーザ辞書の実ファイル名はどちらも `aq_user.dic`。マニュアルだけ `aq_usr.dic` と `aq_user.dic` が混在している（ファイルのリネームではない）。

AqUsrDic_Export（評価版 dylib、`/tmp` CSV）:

- 評価版サンプル: 博麗霊夢・きゃりーぱみゅぱみゅ・離活 など（現行 large に無い行がある）
- 現行 large / aqk2k_mac: 天王洲・スマホ・忖度 など（評価版サンプルに無い行がある）

CSV の列（表記, 読み, 品詞コード）は同じ。

## AqKanji2Koe vs AqKanji2Koe-A

- 製品名が **AqKanji2Koe-A**。フォルダ名に `-A` は付かない（[sdk-inventory.md](./sdk-inventory.md) と同じ）
- Ver.4.1: Apple Silicon、**framework → dylib**
- ヘッダ: 2025/04/23 Ver.4.1.1。readme / マニュアルは Ver.4.1
- Intel スライスは無い。最新版 arm64 専用方針とは合う
- 評価制限は従来どおり「ナ行・マ行がヌ」。開発ライセンスキーで解除。製品版の別 dylib は無い（readme）

## 計画への意味

- アプリが今使う `Convert` はそのままの呼び方で足りる
- `ConvertW` 削除は、現行アプリからは影響しない
- `ConvRoman` は今は使っていない。足さなくてよい
- パス追従は THEN: `.framework` → `libAqKanji2Koe.dylib`、`aq_dic_large` → `aq_dic`
- 辞書は評価版セットで揃える想定。ハッシュ不一致は棚卸しどおり。Convert が現行辞書でも動くことと、読みが同じことは別
- koffi はホスト Node で通った。選んだ Electron の中はまだ（LATER / THEN）

## やっていないこと

- `maquestalk1` / アプリの書き換え
- vendor への dylib / 辞書投入
- 本番 Electron renderer からの Convert
- 開発ライセンスキーでの制限解除
- `requirements.md` / `design.md` / `tasks.md` / `spec.json`
- SDK / 辞書バイナリの git / store コピー
