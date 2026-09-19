# 評価版 SDK 棚卸し（調査 1）

taku-o 向け。バイナリは git / 作業用 store にコピーしていない。実装もビルドもしていない。

観測日: 2026-09-18。実測パスのみ。WAV ヘッダの実測は後の [survey-small-pass.md](./survey-small-pass.md)（koffi スニペット）。この棚卸し時点ではヘッダと付属マニュアルの記載。

## 一目で

**Mac 評価版 4 本は、DMG と展開済みの両方がある。arm64 の dylib。`.framework` は無い。iOS SDK はこの drop に無い。**

| 欲しいもの | この drop |
| --- | --- |
| AquesTalk1 Mac | ある（arm64 のみ） |
| AquesTalk2 Mac | ある（arm64 + x86_64） |
| AquesTalk10 Mac | ある（arm64 + x86_64） |
| AqKanji2Koe-A Mac（AqUsrDic 同梱） | ある（arm64 のみ） |
| AquesTalk1 iOS | **無い**（4 本の対象外。現行 vendor の iOS bridge 用） |

パス: `/Users/taku-o/Desktop/myukkurivoice-lib`

## 置き方

```
myukkurivoice-lib/
  AquesTalk評価版dmg/     ← 公式 DMG 4つ（未マウントのまま）
  AquesTalk1/             ← 展開済み
  AquesTalk2/
  AquesTalk10/
  AqKanji2Koe/            ← 製品名は AqKanji2Koe-A。フォルダ名に -A は無い
```

形式は全部 **dylib**。`.framework` / `.a` / `.so` は 0 件。

サンプル配下の dylib は、対応する `lib/` と同じ中身（`cmp` 一致）。

## 公式 4 パッケージとの対応

公式 Download 表（2025-04、apple-cpu-plan.md）との突き合わせ。

| 公式 | DMG（実ファイル） | 展開フォルダ | パッケージが言う版 | 備考 |
| --- | --- | --- | --- | --- |
| AquesTalk1 Mac 2.0.1 (2025/04/23) `aqtk1_mac_0201.dmg` | 2.3M、日付 2026-09-18 17:04 | `AquesTalk1/` | readme / マニュアル / ヘッダは **V.2.0**（2025/04/20・04/14） | DMG 名は 0201。中身表記は 2.0。dylib 日付 2025-04-22 |
| AquesTalk2 Mac 2.4.1 (2025/04/27) `aqtk2_mac_eva_0241.dmg` | 1.7M | `AquesTalk2/` | readme **Ver.2.4.1**、マニュアル改訂は 2.4 (2025/04/27) | 評価専用名 `libAquesTalk2Eva.dylib` |
| AquesTalk10 Mac 1.1.1 (2025/04/28) `aqtk10_mac_111.dmg` | 2.2M | `AquesTalk10/` | readme / マニュアル **V.1.1.1** | 一致 |
| AqKanji2Koe-A Mac 4.1.1 (2025/04/26) `aqk2k_mac_411.dmg` | 11M | `AqKanji2Koe/` | ヘッダ **Ver.4.1.1**。readme / マニュアルは **Ver.4.1** | DMG 名は 411。AqUsrDic は同梱 |

**欠けている公式 Mac 4 本は無い。**

drop 内の小さな欠け:

- AquesTalk2 `readme.txt` が挙げる `aqtk2_mac_sdk_lic.pdf` は展開フォルダに無い
- 同じ readme のパッケージ表は `libAqKanji2KoeEva.dylib` と書いてあるが、実体は `libAquesTalk2Eva.dylib`（誤記）

## 製品ごとの中身

### AquesTalk1 Mac — `AquesTalk1/`

- 形式: 声種ごとの dylib。1 ファイル = 1 声種
- arch: **arm64 のみ**（Intel 非対応。マニュアル明記）
- ヘッダ: `AquesTalk1-mac.h`
- マニュアル: `aqtk1_mac_man.pdf` / `siyo_onseikigou.pdf`
- サンプル: `HelloAquesTalk`（Swift）、`AqTkCmd`（C++。stdin → WAV）
- 声種 9（`lib/libAquesTalk1-XX.dylib`）: `f1` `f2` `f3` `m1` `m2` `r1` `dvd` `imd1` `jgr`
- サンプリング: **8kHz / 16bit / mono / WAV**（ヘッダは「8HKz」、マニュアルは「8KHz」）
- API: `AquesTalk_Synthe_Utf8` / `AquesTalk_FreeWave` / `AquesTalk_SetDevKey` / `AquesTalk_SetUsrKey`
- 現行 vendor との差:
  - 今は `AquesTalk.framework`（i386 + ppc）。声種切替は `AquesTalk_SyntheMV(idVoice, ...)`
  - 新 SDK は UTF-8 専用。SJIS の `AquesTalk_Synthe` も `SyntheMV` も無い
  - アプリが今使う talk1 は `f1` と `m1` だけ。新 SDK にはあと 7 声種がある
- `AqTkCmd` は評価キーなしだとナ行・マ行がヌ。サンプルはプレースホルダキーを `SetDevKey` している

### AquesTalk2 Mac 評価版 — `AquesTalk2/`

- 形式: `lib/libAquesTalk2Eva.dylib`（製品版名はマニュアル上 `libAquesTalk2.dylib`）
- arch: **x86_64 + arm64**（fat）
- ヘッダ: `AquesTalk2.h`
- phont: 14 ファイル（マニュアル「声種 14 種」。`ar_f4.phont` が内蔵デフォルトと同じ）
- サンプリング: **8kHz / 16bit / mono / WAV**
- API: `AquesTalk2_Synthe`（SJIS）/ `_Utf8` / `_Utf16` / `AquesTalk2_FreeWave`
- ヘッダ注記: `AquesTalk2_Synthe_Euc` と `AquesTalk2_Synthe_Roman` は削除
- **SetDevKey は無い。** 評価専用 dylib。制限解除は製品版ライブラリ側
- 現行アプリが読む talk2 関数名（`AquesTalk2_Synthe_Utf8`）はそのまま使える想定。パスは framework → dylib

phont 一覧（評価版）:

`aq_f1c` `aq_f3a` `aq_huskey` `aq_m4b` `aq_mf1` `aq_rb2` `aq_rb3` `aq_rm` `aq_robo` `aq_yukkuri` `ar_f4` `ar_m5` `ar_mf2` `ar_rm3`

現行 vendor / アプリにあるが、**公式評価版パッケージには無い**:

`aq_defo1.phont` `aq_momo1.phont` `aq_teto1.phont`

（現行 17 本のうち、公式 14 + アプリ独自 3。アプリが 2016-12-30 に後から足した）

ディスク上の展開フォルダへ、調査で現行 vendor からコピーした（git には入れていない）。`AquesTalk2_Synthe_Utf8` では **3つとも works**。詳細: [survey-talk2-phonts.md](./survey-talk2-phonts.md)

### AquesTalk10 Mac — `AquesTalk10/`

- 形式: `lib/libAquesTalk10.dylib`
- arch: **x86_64 + arm64**（fat）。マニュアルは macOS 11 以降
- ヘッダ: `AquesTalk10.h`（現行 vendor は `AquesTalk.h`）
- サンプリング: **16kHz / 16bit / mono / WAV**。`fsc` で周波数が変わる（ヘッダ・マニュアルとも）
- 現行アプリの再生は 8000Hz 扱い。talk10 は前から 16kHz 記載。koffi スニペットで実測済み（[survey-small-pass.md](./survey-small-pass.md)）。アプリ再生経路はまだ
- API: `AquesTalk_Synthe` / `_Utf8` / `_Utf16` / `FreeWave` / `SetDevKey` / `SetUsrKey`
- 構造体: `AQTK_VOICE`（`bas spd vol pit acc lmd fsc`）。プリセット `gVoice_F1`〜`R2` は現行アプリと同じ値
- 現行ヘッダとの差: typedef 名が `_AQTK_PARAM_` → `_AQTK_VOICE_`。フィールドは同じ。関数名は同じ

### AqKanji2Koe-A + AqUsrDic — `AqKanji2Koe/`

- 形式: `lib/libAqKanji2Koe.dylib` と `lib/libAqUsrDic.dylib`（別 dylib。別 framework ではない）
- arch: **どちらも arm64 のみ**（Intel 非対応）
- ヘッダ: `AqKanji2Koe.h`（2025/04/23 Ver.4.1.1）、`AqUsrDic.h`（2025/04/25 Ver.4.1.1）
- 辞書: `aq_dic/aqdic.bin`（9.4M、2022-01-27）+ `aq_user.dic` + `CREDITS`
- マニュアルの辞書サイズ表記は「約 7MB（約 36 万語）」。実ファイルは 9.4M
- 現行 `vendor/aq_dic_large/aqdic.bin` は 12M で **ハッシュ不一致**。`aqk2k_mac/aq_dic/aqdic.bin`（7.2M）とも不一致。差し替え時は辞書を評価版セットで揃える必要あり
- API 残: `AqKanji2Koe_Create` / `Create_Ptr` / `Release` / `Convert`（UTF-8）/ `SetDevKey`
- API 増: `AqKanji2Koe_ConvRoman`
- API 減: 現行の `AqKanji2Koe_ConvertW`（UTF-32）は新ヘッダに無い
- AqUsrDic: `Import` / `Export` / `Check` / `GetLastError`（現行と同じ系統）

## アーキテクチャ早見

`lipo -info` / `file` の実測。

| バイナリ | arch |
| --- | --- |
| `libAquesTalk1-*.dylib`（9 + サンプル複製） | arm64 のみ |
| `libAquesTalk2Eva.dylib` | x86_64 + arm64 |
| `libAquesTalk10.dylib` | x86_64 + arm64 |
| `libAqKanji2Koe.dylib` | arm64 のみ |
| `libAqUsrDic.dylib` | arm64 のみ |

install_name はすべて `@rpath/...dylib`。アプリ側は Runpath か配置の追従が要る。

最新版アプリは arm64 専用方針なので、arm64 スライスはある。AquesTalk1 と辞書は **Intel スライスが無い**（今回は対象外）。

## 現行 vendor レイアウトとの差（パス追従の種）

今のアプリが読む場所（`vendor/`）:

- `AquesTalk.framework` / `AquesTalk2.framework` / `AquesTalk10.framework` / `AqKanji2Koe.framework` / `AqUsrDic.framework`
- `phont/` / `aq_dic_large/`

評価版:

- `lib/*.dylib`（framework ではない）
- 辞書ディレクトリ名は `aq_dic`（`aq_dic_large` ではない）
- AquesTalk1 は声種 dylib の切替（1 framework + `idVoice` ではない）

この差は調査 1 の事実。パス変更の実装はしていない。

## サンプリングレート

棚卸し時点はヘッダ / マニュアルの記載。WAV ヘッダ実測は [survey-small-pass.md](./survey-small-pass.md)。

| エンジン | ヘッダ | 付属マニュアル | 現行アプリの扱い | koffi スニペット |
| --- | --- | --- | --- | --- |
| AquesTalk1 | 8kHz | 8kHz | 8000Hz | 8000Hz |
| AquesTalk2 | 8kHz | 8kHz | 8000Hz | 8000Hz |
| AquesTalk10 | 16kHz。`fsc` で変化 | 16kHz。`fsc` で変化 | 再生経路は 8000Hz 前提が残る | `fsc=100` で 16000Hz |

## この drop に無いもの

公式 Mac 4 本の欠けは無い。

無い / このフォルダの外:

- **AquesTalk1 iOS**（現行 `maquestalk1-ios` / `vendor/aqtk1-ios` 用。今は取らない。Mac AT1 が足りないと証明されたときだけ）
- 製品版 AquesTalk2 dylib（評価版は `*Eva*` のみ）
- talk2 の `aq_defo1` / `aq_momo1` / `aq_teto1` phont（公式パッケージには無い。調査で現行からコピーした。Synthe は works。git には入れていない）
- AquesTalk2 の `aqtk2_mac_sdk_lic.pdf`

## やっていないこと

- SDK バイナリのコピー（git / store へ入れない）
- `maquestalk1` / `maquestalk1-ios` / `secret` の製品ビルド（この棚卸しではしていない。`secret` arm64 は後の [survey-small-pass.md](./survey-small-pass.md)）
- 本番アプリの FFI
- `requirements.md` / `design.md` / `tasks.md` / `spec.json` の作成
