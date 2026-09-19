# THEN 1 作業記録（vendor ファイル）

Claude Code 向け。この作業は **`myukkurivoice-vendor` へのファイル投入**。

**このタスクの範囲:** vendor ファイル。`/kiro-*` は走らせない。仕様書を作るな、ではない。`requirements.md` / `design.md` / `tasks.md` / `prompt.md` / `spec.json` は、taku-o が Claude Code に `/kiro-spec-requirements` を出したとき、cc-sdd の spec ディレクトリへ置く。**このフォルダには置かない。**

計画の正本は [../00-planing/](../00-planing/)。ここには THEN 1 の作業内容だけ書く。00-planing を再掲しない。

観測日: 2026-09-19。SDK バイナリはコピーしていない。

## このタスクで読むもの

| ファイル | 内容 |
| --- | --- |
| [README.md](./README.md) | この索引。ブランチ、リポジトリ、投入の範囲 |
| [claude-handoff.md](./claude-handoff.md) | THEN 1 でやること / やらないこと |
| [sources.md](./sources.md) | 実ディスクの source → vendor 投入先。arch。コピーしないもの |

## このフォルダと 00-planing

| 場所 | 役割 |
| --- | --- |
| `.kiro/specs/00-planing/` | Apple CPU 計画・再開・調査 |
| `.kiro/specs/01-vendor-updates/` | THEN 1（`myukkurivoice-vendor` へのファイル投入）の作業記録と Claude Code 引き渡し。**vendor 作業のメモはここだけに書く** |

vendor / secret / maquestalk1 リポジトリへメモを散らさない。

THEN 1 の中身は upcoming-work の定義どおり: 評価版 SDK、AT1 声種 dylib、`secret` の arm64、talk2 追加 3 phont。`maquestalk1` / `maquestalk1-ios` のバイナリは入れない。アプリは `vendor/` を読むので、ファイルが先。アプリコードは THEN 2/3。

## 誰が何をするか（このタスク）

| 担当 | このタスクでやること | このタスクでやらないこと |
| --- | --- | --- |
| **Claude Code** | `myukkurivoice-vendor` へ THEN 1 のファイルを置く（[claude-handoff.md](./claude-handoff.md)） | 本体アプリの書き換え。`maquestalk1` の書き直し。CLI バイナリを vendor に入れる。評価版を store / `myukkurivoice` git ツリーへコピー。`/kiro-*`。仕様書を **このフォルダ** に置くこと |
| **Cursor** | 進捗管理。仕様の決定 | 製品コード。SDK を本体 git / store にコピー。vendor へ SDK を投入 |

## リポジトリとブランチ（2026-09-19 ローカル）

作業記録は本体。ファイル投入は vendor clone。

| リポジトリ | ローカルパス | ブランチ | 起点 | 状態 |
| --- | --- | --- | --- | --- |
| myukkurivoice | `/Users/taku-o/Desktop/myukkurivoice` | `feature/applecpu/vender-updates`（綴りは vender） | `feature/applecpu/master`（`dfc9d73` = `origin/feature/applecpu/master`） | ローカルに作成して checkout。origin には無い |
| myukkurivoice-vendor | `/Users/taku-o/Desktop/myukkurivoice-vendor` | `feature/applecpu/master` | `master`（`4e211a0` = `origin/master`） | ローカルに作成して checkout。ファイル追加はしていない。origin には無い |

本体の submodule `vendor/` は同じ `4e211a0` を指す。THEN 1 の書き込み先は **Desktop の vendor clone**。本体の `vendor/` や store に SDK を置かない。

関連パス（メモを書かない）:

| パス | 役割 | THEN 1 |
| --- | --- | --- |
| `/Users/taku-o/Desktop/myukkurivoice-lib` | 評価版 SDK drop。git に入れない | 読み元。コピー先ではない |
| `/Users/taku-o/Desktop/myukkurivoice-secret` | `secret` の Go ソース | arm64 のビルド元。リポジトリへメモを書かない |
| `/Users/taku-o/Desktop/maquestalk1` | AT1 Mac CLI | 触らない。バイナリを vendor に入れない |
| `/Users/taku-o/Desktop/maquestalk1-ios` | AT1 iOS CLI | 触らない。バイナリを vendor に入れない |

## 本体アプリが今読む場所（変更しない）

アプリは unpacked の `vendor/` を読む。パス追従は THEN 2/3。THEN 1 では `js/` も gulp も触らない。現行の参照だけ:

- `AquesTalk2.framework` / `AquesTalk10.framework` / `AqKanji2Koe.framework` / `AqUsrDic.framework`
- `phont/*.phont`（公式 14 + `aq_defo1` / `aq_momo1` / `aq_teto1`）
- `aq_dic_large`
- `secret`
- talk1 は `maquestalk1` / `maquestalk1-ios`（THEN 2 で捨てる）

評価版は **dylib**。`.framework` は無い。詳細は [sources.md](./sources.md)。
