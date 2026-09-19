# THEN 1 ソースと投入先（実測）

2026-09-19。`lipo -info` / `file` / `cmp` / `shasum -a 256`。パスはディスク上の実在だけ。推測のフォルダ名は作っていない。

計画の SDK 説明は [../00-planing/sdk-inventory.md](../00-planing/sdk-inventory.md)。talk2 3 phont は [../00-planing/survey-talk2-phonts.md](../00-planing/survey-talk2-phonts.md)。ここは投入用の対応表。

評価版は **vendor リポジトリだけ** に置く。作業用 store と `myukkurivoice` git ツリーへは置かない。ライセンス: 評価版の再配布禁止（各 readme「当社の許可なく再配布や公開することを禁じます」）。現行 vendor は既にアクエスト製 SDK を同じ private リポジトリで持っている。その扱いに合わせる。

## 作業先

書き込み: `/Users/taku-o/Desktop/myukkurivoice-vendor`（ブランチ `feature/applecpu/master`）

本体 submodule `/Users/taku-o/Desktop/myukkurivoice/vendor` は同じ commit `4e211a0`。THEN 1 では **clone 側** に置く。本体 `vendor/` へ直接コピーしない。

現行 vendor は二層:

1. **SDK パッケージ** — `aqtk1-mac/` `aqtk2-mac/` `aqtk10-mac/` `aqk2k_mac/` `aqtk1-ios/`
2. **アプリが読むルート** — `*.framework` `phont/` `aq_dic_large/` `secret` `maquestalk1` `maquestalk1-ios`

gulp が unpack するルート側: `AqKanji2Koe.framework` `AqUsrDic.framework` `AquesTalk2.framework` `AquesTalk10.framework` `aq_dic_large` `phont` `maquestalk1-ios` `secret`、darwin のみ `AquesTalk.framework` `maquestalk1`。

評価版に `.framework` は無い。ルートの framework パスへ dylib を上書きしない。パッケージ用フォルダは **既にある名前**（`aqtk1-mac` 等）へ評価版の中身を入れる。ルートの実行ファイルは評価版の **元のファイル名** で置く（改名しない）。

## 評価版 drop（読み元。git に入れない）

`/Users/taku-o/Desktop/myukkurivoice-lib`

```
AquesTalk評価版dmg/   ← DMG 4つ。vendor に入れない
AquesTalk1/
AquesTalk2/
AquesTalk10/
AqKanji2Koe/          ← 製品名は AqKanji2Koe-A。フォルダ名に -A は無い
```

iOS SDK はこの drop に **無い**（`find … *ios*` 0 件）。

### AquesTalk1 → vendor `aqtk1-mac/` とルートの声種 dylib

ソース `/Users/taku-o/Desktop/myukkurivoice-lib/AquesTalk1/`

| ソース | 入れる | 入れない |
| --- | --- | --- |
| `lib/libAquesTalk1-{f1,f2,f3,m1,m2,r1,dvd,imd1,jgr}.dylib` | パッケージ `aqtk1-mac/` 相当、およびルートに同名 | サンプル内の複製 `samples/*/libAquesTalk1-f1.dylib` |
| `AquesTalk1-mac.h` `readme.txt` `aqtk1_mac_man.pdf` `siyo_onseikigou.pdf` | `aqtk1-mac/` 相当 | |
| `samples/` | 現行 `aqtk1-mac/SamplePrograms` があるのでパッケージ側に含めてよい | ルートへは出さない |

アプリが今使う talk1 は f1 / m1（`js/models.main.ts` の `idVoice` 0 / 1）。9 声種とも `lib/` から入れる。

現行ルート `AquesTalk.framework/AquesTalk` は **i386 + ppc**。入れ替え先は dylib であり、この framework バイナリではない。

### AquesTalk2 → vendor `aqtk2-mac/` とルート dylib + `phont/`

ソース `/Users/taku-o/Desktop/myukkurivoice-lib/AquesTalk2/`

| ソース | 投入先 |
| --- | --- |
| `lib/libAquesTalk2Eva.dylib` | パッケージ `aqtk2-mac/` 相当、およびルートに同名（現行 `AquesTalk2.framework` の代わりの実体） |
| `phont/` 公式 14 種 | ルート `phont/`（現行アプリが読む場所）。パッケージ側にも評価版どおり置いてよい |
| `AquesTalk2.h` `readme.txt` `aqtk2_mac_man.pdf` `siyo_onseikigou.pdf` | `aqtk2-mac/` 相当 |
| `samples/` | パッケージ側のみ |

評価版 readme の `libAqKanji2KoeEva.dylib` は誤記。実体は `libAquesTalk2Eva.dylib`。`aqtk2_mac_sdk_lic.pdf` は展開フォルダに無い。

### AquesTalk10 → vendor `aqtk10-mac/` とルート dylib

ソース `/Users/taku-o/Desktop/myukkurivoice-lib/AquesTalk10/`

| ソース | 投入先 |
| --- | --- |
| `lib/libAquesTalk10.dylib` | パッケージ `aqtk10-mac/` 相当、およびルートに同名 |
| `AquesTalk10.h` `readme.txt` `aqtk10_mac_man.pdf` `siyo_onseikigou.pdf` | `aqtk10-mac/` 相当 |
| `samples/` | パッケージ側のみ |

現行ルート `AquesTalk10.framework/AquesTalk` は **x86_64**。ヘッダ名も現行 framework 内は `AquesTalk.h`、評価版は `AquesTalk10.h`。

### AqKanji2Koe-A → vendor `aqk2k_mac/` とルート dylib + 辞書

ソース `/Users/taku-o/Desktop/myukkurivoice-lib/AqKanji2Koe/`

| ソース | 投入先 |
| --- | --- |
| `lib/libAqKanji2Koe.dylib` | パッケージ `aqk2k_mac/` 相当、およびルートに同名 |
| `lib/libAqUsrDic.dylib` | 同上（現行は別 `AqUsrDic.framework`） |
| `aq_dic/aqdic.bin` `aq_dic/aq_user.dic` `aq_dic/CREDITS` | パッケージ `aqk2k_mac/aq_dic/`、およびアプリが読む `aq_dic_large/`（フォルダ名は現行のまま。評価版のディレクトリ名は `aq_dic`。アプリのパス変更は THEN 2/3） |
| `AqKanji2Koe.h` `AqUsrDic.h` `readme.txt` `aqk2k_mac_man.pdf` `siyo_onseikigou.pdf` | `aqk2k_mac/` 相当 |
| `samples/` | パッケージ側のみ |

辞書は中身が違う。評価版セットで揃える（sdk-inventory / survey-aqkanji2koe）。

| ファイル | サイズ | sha256 先頭 |
| --- | --- | --- |
| 評価版 `aq_dic/aqdic.bin` | 9,847,992 | `829ee0ead4423163…` |
| 現行 `aq_dic_large/aqdic.bin` | 12,773,560 | `ce73237455c8b18c…` |
| 現行 `aqk2k_mac/aq_dic/aqdic.bin` | 7,521,360 | `291ced5a9f5a16c5…` |

評価版 `aq_dic` に `aq_user.csv` は無い。現行 `aq_dic_large/aq_user.csv` はある。CSV を評価版から作らない。残すか消すかは taku-o 確認。

## talk2 追加 3 phont

公式評価版パッケージには無い。現行アプリが後から足した。新評価版へコピーすると Synthe **works**（survey-talk2-phonts）。

ソース（2026-09-19、三者 `cmp` 一致）:

- `/Users/taku-o/Desktop/myukkurivoice/vendor/phont/aq_defo1.phont`
- `/Users/taku-o/Desktop/myukkurivoice/vendor/phont/aq_momo1.phont`
- `/Users/taku-o/Desktop/myukkurivoice/vendor/phont/aq_teto1.phont`

同じバイトが vendor clone の `phont/` と、調査でコピー済みの `myukkurivoice-lib/AquesTalk2/phont/` にもある。投入の正本は **現行アプリ vendor / vendor clone の `phont/`**。評価版公式 14 種の隣に残す。

投入先: `/Users/taku-o/Desktop/myukkurivoice-vendor/phont/{aq_defo1,aq_momo1,aq_teto1}.phont`

公式 14 種（`aq_f1c` `aq_f3a` `aq_huskey` `aq_m4b` `aq_mf1` `aq_rb2` `aq_rb3` `aq_rm` `aq_robo` `aq_yukkuri` `ar_f4` `ar_m5` `ar_mf2` `ar_rm3`）は現行 `phont/` と評価版 `AquesTalk2/phont/` が **全部 `cmp` 一致**。

## `secret` arm64

| 何 | パス | arch |
| --- | --- | --- |
| ソース | `/Users/taku-o/Desktop/myukkurivoice-secret/src/secret/secret.go` | （Go） |
| checkout バイナリ（コピーしない） | `/Users/taku-o/Desktop/myukkurivoice-secret/src/secret/secret` | x86_64 |
| 現行 vendor | `/Users/taku-o/Desktop/myukkurivoice-vendor/secret` | x86_64（checkout と `cmp` 一致） |
| 調査残骸（採用しない） | `/tmp/applecpu-now-survey/secret-arm64` | arm64 |

投入先: `/Users/taku-o/Desktop/myukkurivoice-vendor/secret`（ソースから arm64 でビルドしたもの）

## コピーしないもの

| 対象 | 理由 |
| --- | --- |
| `maquestalk1` バイナリ（vendor ルート / Desktop clone） | THEN 1 の投入対象外。THEN 2 で捨てる |
| `maquestalk1-ios` バイナリ | 同上 |
| `/Users/taku-o/Desktop/maquestalk1` の成果物 | CLI を書かない・入れない |
| `/Users/taku-o/Desktop/maquestalk1-ios` の成果物 | 同上 |
| `aqtk1-ios/`（現行 vendor の iOS SDK。`lib/libAquesTalk.a` は i386/armv7/armv7s/x86_64/arm64） | iOS SDK は今は取らない。評価版 drop にも無い |
| `AquesTalk評価版dmg/*.dmg` | 現行 vendor に DMG は無い。展開済みを使う |
| 評価版 `samples/` 配下の dylib 複製 | `lib/` と同じ中身。ルートには出さない |
| 評価版を作業用 store へ | 禁止 |
| 評価版を `myukkurivoice` git ツリーへ直置き | 禁止。行き先は vendor リポジトリ |
| checkout の x86_64 `secret` | arm64 をソースから建てる |
| `.DS_Store` | vendor `.gitignore` 済み |

## arch（現行 vendor ルート vs 評価版 dylib）

現行 vendor clone（アプリが読むルート）:

| バイナリ | arch |
| --- | --- |
| `AquesTalk.framework/AquesTalk` | i386, ppc |
| `AquesTalk2.framework/AquesTalk2` | x86_64 |
| `AquesTalk10.framework/AquesTalk` | x86_64 |
| `AqKanji2Koe.framework/AqKanji2Koe` | x86_64 |
| `AqUsrDic.framework/AqUsrDic` | x86_64 |
| `maquestalk1` | i386 |
| `maquestalk1-ios` | x86_64 |
| `secret` | x86_64 |

現行 SDK パッケージ内（参考。ルートよりスライスが多いものあり）:

| バイナリ | arch |
| --- | --- |
| `aqtk1-mac/AquesTalk.framework/AquesTalk` | i386, ppc |
| `aqtk2-mac/AquesTalk2.framework/AquesTalk2` | x86_64, i386 |
| `aqtk10-mac/AquesTalk10.framework/AquesTalk` | x86_64, i386 |
| `aqk2k_mac/AqKanji2Koe.framework/AqKanji2Koe` | x86_64, i386 |
| `aqk2k_mac/AqUsrDic.framework/AqUsrDic` | x86_64, i386 |

評価版 dylib（`lib/`）:

| バイナリ | arch | install_name |
| --- | --- | --- |
| `libAquesTalk1-*.dylib`（9 声種） | arm64 のみ | `@rpath/libAquesTalk1-XX.dylib` |
| `libAquesTalk2Eva.dylib` | x86_64 + arm64 | `@rpath/libAquesTalk2Eva.dylib` |
| `libAquesTalk10.dylib` | x86_64 + arm64 | `@rpath/libAquesTalk10.dylib` |
| `libAqKanji2Koe.dylib` | arm64 のみ | `@rpath/libAqKanji2Koe.dylib` |
| `libAqUsrDic.dylib` | arm64 のみ | `@rpath/libAqUsrDic.dylib` |

最新版アプリは arm64 専用方針。AT1 と辞書 dylib に Intel スライスは無い。

## 現行アプリの読み先（THEN 1 では変えない）

`vendorPath` = unpacked `vendor/`。

| 用途 | 現行パス |
| --- | --- |
| AT2 | `AquesTalk2.framework/Versions/A/AquesTalk2` |
| AT10 | `AquesTalk10.framework/Versions/A/AquesTalk` |
| AqKanji2Koe | `AqKanji2Koe.framework/Versions/A/AqKanji2Koe` |
| AqUsrDic | `AqUsrDic.framework/Versions/A/AqUsrDic` |
| 辞書 | `aq_dic_large` |
| talk2 phont | `phont/<id>.phont` |
| talk1 | `maquestalk1` または `maquestalk1-ios` |
| ライセンスキー | `secret` |
