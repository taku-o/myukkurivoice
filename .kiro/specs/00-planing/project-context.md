# MYukkuriVoice Apple CPU 対応 — プロジェクト文脈

taku-o 向け。実装の入口ではない。方針の正本は下のソース。短い作業順は [upcoming-work.md](./upcoming-work.md)。cc-sdd の使い方は [cc-sdd-adoption.md](./cc-sdd-adoption.md)。

**番号の見分け（混ぜない）**

| 呼び方 | 中身 |
| --- | --- |
| **THEN 1–9** | 製品の作業順。1 vendor ファイル、2 talk1 CLI→dylib、3 ffi-napi→koffi、4 `@electron/remote`、5 Electron/Node（Node は Electron 同梱）、6 パッケージ、**7 テスト**、8 CI、9 独立ライブラリ |
| **cc-sdd** | コマンド名で呼ぶ。番号を THEN と共有しない |

- Cursor: `/kiro-spec-requirements` → `/kiro-validate-gap` → `/kiro-spec-design` → `/kiro-validate-design` → `/kiro-spec-tasks`
- Claude Code: `/kiro-review-spec` → `/kiro-impl` → `/kiro-validate-impl` → `/kiro-review-feature` / `/code-review`
- 裸の「工程 7」は使わない

**進め方:** これからは **cc-sdd**（`.cursor/skills/kiro-*`）で進める。コマンドは1つずつ。taku-o が次を言うまで止まる。`/kiro-spec-init` は使わない。`-y` は使わない。`approved` は自分で立てない。調査は済んだ。アクティブな spec は無い。アプリ全体を作らないと確かめられない調査は後回し。cc-sdd の正本は [cc-sdd-adoption.md](./cc-sdd-adoption.md)。

**誰がやるか（2026-09-19）:** Cursor は進捗・仕様・引き渡し（`/kiro-spec-requirements` … `/kiro-spec-tasks`）。製品実装は Claude Code（`/kiro-impl` 以降）。`/kiro-review-spec` と `/kiro-review-feature` は Claude Code 専用。Cursor では動かない。Cursor は製品実装を始めない。

## ソース・オブ・トゥルース

- リポジトリ: [taku-o/myukkurivoice](https://github.com/taku-o/myukkurivoice)
- ブランチ: `feature/applecpu/master`
- 再開入口: `.kiro/specs/00-planing/resume.md`
- 計画本体: `.kiro/specs/00-planing/planning.md`
- ユーザー発言メモ: `.kiro/specs/00-planing/prompt.md`

確認した先端: `ba8280d`（計画ドキュメントを origin へ載せたコミット）。再開時は `git log -1` で確認。

## 何をするか

MYukkuriVoice の**最新版を Apple Silicon（arm64）専用**にし、そのために必要な範囲で古いライブラリを上げる。

新機能は作らない。現行の音声生成・録音・設定・辞書・動画連携を、arm64 で動かし続けることが目的。

**taku-o 決定（2026-09-18）:** 新版の AquesTalk1 は **Mac 評価版**を使う。iOS は Mac AT1 が無かったときの回避策。iOS SDK は取らない。Mac AT1 が足りないと証明されたときだけ戻す。調査: [survey-maquestalk1.md](./survey-maquestalk1.md)

## 確定している方針

- 最新版は **arm64 のみ**。Intel / Universal / Rosetta は対象外
- **AngularJS 1.x** と **`nodeIntegration: true` は維持**。preload 全面移行はしない
- ドキュメントにない機能は作らない。最適化・フォールバックは入れない
- **AquesTalk1 は Mac 評価版を使う。** iOS は、昔 Mac AT1（i386）が動かなかったときの回避策。新版で iOS SDK を取らない・要求しない。Mac AT1 が足りないと証明されたときだけ、最後の手段として戻す。調査: [survey-maquestalk1.md](./survey-maquestalk1.md)
- 現行 vendor に arm64 は無い。開発はアクエストの **評価版 SDK** を使う。評価版の再配布はしない。有償ライセンスは、評価版で足りないと分かってから決める
- 評価版の置き場: `/Users/taku-o/Desktop/myukkurivoice-lib`（Mac 4 本は DMG + 展開済み。形式は dylib。iOS は無い）。棚卸しは [sdk-inventory.md](./sdk-inventory.md)
- `vendor/` は自作 submodule `myukkurivoice-vendor`。アクエスト製ライブラリと自作 CLI をまとめる場所
- `maquestalk1` / `maquestalk1-ios` / `secret` は自作。現行は外部コマンド。新版の AT1 は koffi 直呼び。`maquestalk1` も `maquestalk1-ios` も捨てる（書き直さない）。`secret` は残す
- 独立ライブラリ: 同じメジャーは上げる。メジャーが飛ぶものは可能なら上げる。干渉したら黙って戻さず報告する
- `intro.js` は 8.x へ上げ、既存チュートリアル UI の変更も試みる。新しいステップは足さない。他 UI は多少の変化は許容、大幅な作り直しはしない
- 自前 npm で今すぐ上げられるのは `fcpx-audio-role-encoder` 0.1.2 → 0.1.4 だけ。他の GitHub 直指定パッケージは既に最新タグ
- テストコードは許可なく変更しない。Spectron → Playwright は許可が必要
- 「完了」「complete」等はユーザーの許可なく使わない。完了判定はユーザーがする

## やらないこと

- `/kiro-spec-init` を使う。`at1-koffi-direct` を再作成する
- taku-o の `/kiro-spec-requirements` なしに `requirements.md` / `design.md` / `tasks.md` / `spec.json` を新規作成する
- `spec.json` の `approved` を自己判断で `true` にする
- `-y` と `/kiro-spec-quick --auto` で承認ゲートを飛ばす
- cc-sdd コマンドをまとめて進める（`/kiro-spec-requirements` のあと `/kiro-validate-gap` を自分で続けない）
- Angular 置き換え、preload 全面移行、Universal Binary、Rosetta 前提の回避
- 評価版 SDK を配布物に入れる
- 一括 sed / 一括ライブラリ更新
- テストコードの無許可変更
- 干渉したライブラリを黙って戻す・コメントアウトして「対応」とする
- 一時実装やダミーで「実装した」ことにする
- 指示なしに実装や要件定義を始める
- Cursor で製品実装を始める。Cursor で `/kiro-impl` を走らせる
- Cursor で `/kiro-review-spec` / `/kiro-review-feature` が動くと装う（Claude Code 専用。`.claude/commands`）
- `.claude/commands` を `.cursor` へ symlink / コピーする（taku-o が言うまで）
- アプリ全体を作らないと確かめられない調査を、小さい調査より先にやる

## ブランチ規則

自前リポジトリを触るとき:

- 起点: `develop` があればそこ。なければ `master`
- 作業ブランチ名: **`feature/applecpu/master`**（本体に合わせる）
- `develop` / `master` 上では直接作業しない
- 本体 `myukkurivoice` は既に `feature/applecpu/master`。それを継続する
- `staging` は他リポジトリの起点にしない
- コミット / push はユーザーが明示したときだけ
- コミットするとき、`.kiro/specs/00-planing/prompt.md` が staging にあるなら、**同じコミットに入れる。外さない**
- GitHub 操作は `taku-o`（mail@nanasi.jp）

関連リポジトリ（vendor / secret / maquestalk1 系）は、確認時点ではいずれも `master` のみ。`develop` は無い。作業時に `feature/applecpu/master` を切る。

## 関連リポジトリ

本体:

| 役割 | リポジトリ | 作業ブランチ |
| --- | --- | --- |
| アプリ本体 | [taku-o/myukkurivoice](https://github.com/taku-o/myukkurivoice) | `feature/applecpu/master` 継続 |

ネイティブ / vendor（arm64 再ビルド対象）:

| 役割 | リポジトリ | 備考 |
| --- | --- | --- |
| vendor submodule の実体 | [myukkurivoice/myukkurivoice-vendor](https://github.com/myukkurivoice/myukkurivoice-vendor) | 評価版 SDK と自作 CLI を入れる |
| AquesTalk1 Mac 用 CLI（Xcode） | [myukkurivoice/maquestalk1](https://github.com/myukkurivoice/maquestalk1) | 現行は外部コマンド。新版では捨てる（書き直さない） |
| AquesTalk1 iOS 用 CLI（Xcode） | [myukkurivoice/maquestalk1-ios](https://github.com/myukkurivoice/maquestalk1-ios) | 新版では捨てる。戻すのは Mac AT1 が足りないときだけ |
| ライセンスキー取得 CLI（Go） | [myukkurivoice/myukkurivoice-secret](https://github.com/myukkurivoice/myukkurivoice-secret) | SDK 非依存。指示があれば先に `go build` できる |

taku-o の Desktop 上の作業パス（resume.md）:

- `/Users/taku-o/Desktop/myukkurivoice`
- `/Users/taku-o/Desktop/myukkurivoice-vendor`
- `/Users/taku-o/Desktop/maquestalk1`
- `/Users/taku-o/Desktop/maquestalk1-ios`
- `/Users/taku-o/Desktop/myukkurivoice-secret`
- `/Users/taku-o/Desktop/myukkurivoice-lib`（評価版 SDK。git に入れない）

`docs/development.md` の related links も `myukkurivoice/maquestalk1` と `myukkurivoice/maquestalk1-ios`。Desktop の clone 表記が `taku-o/maquestalk1` でも、GitHub 上の実体は `myukkurivoice` org。

本体が npm / GitHub 直指定で依存する自前パッケージ（今回の版上げ対象はほぼ無し。壊れたら各リポジトリ側を直す）:

- `fcpx-audio-role-encoder`（0.1.2 → 0.1.4 のみ上げる）
- `github-version-compare` / `wav-audio-length` / `wav-fmt-validator`（最新と同じ）
- `electron-path` / `myukkurivoice-about-window` / `caller-position` / `electron-performance-monitor`（タグが最新）

アプリ実行には使わない関連:

- `taku-o/fcpx-audio-role-workflow` — ヘルプからリンクする別アプリ
- `taku-o/gitignore-merge` — kiro 初期セットアップ用

## 現行スタック（対応前）

これは **対応前** の現状。到達版ではない。Electron 6 のままにしない。Node は Electron 同梱に合わせる。

- Electron 6.1.7 / Node.js v12.4.0 / AngularJS 1.7.8
- 配布: `electron-packager --arch=x64` → `MYukkuriVoice-darwin-x64` / `MYukkuriVoice-mas-x64`
- Native: `ffi-napi` + `ref-napi` で AquesTalk2 / 10 / 辞書を呼ぶ。AquesTalk1 と secret は外部コマンド
- ビルド: Gulp 4 / TypeScript 3.5.3
- テスト: Mocha + Chai + Spectron（パスが x64 固定）
- アプリ版: 0.13.10

Renderer は `electron.remote` と `ffi-napi` を直接使う。AngularJS を維持する以上、この構造は残す。

## 調査 1 で分かったこと（SDK パス）

詳細: [sdk-inventory.md](./sdk-inventory.md)

- Mac 評価版 4 本（AquesTalk1 / 2 / 10 / AqKanji2Koe-A）は揃っている。**iOS SDK は drop に無い**（方針上、今は取らない）
- 全部 dylib。`.framework` は評価版側に無い
- arm64: 4 製品ともある。AquesTalk1 と AqKanji2Koe/AqUsrDic は arm64 のみ。AquesTalk2 Eva と AquesTalk10 は universal
- 8kHz: AquesTalk1 / 2。16kHz（`fsc` で変化）: AquesTalk10。koffi スニペットで AT1/AT2=8000、AT10 `fsc=100`=16000 を実測。[survey-small-pass.md](./survey-small-pass.md)。アプリ再生経路はまだ
- 辞書は評価版 `aq_dic`（9.4M）で、現行 `aq_dic_large`（12M）と別。評価版 dylib の Convert は **works**。[survey-aqkanji2koe.md](./survey-aqkanji2koe.md)
- talk2 評価版 phont は公式 14 種。アプリの `aq_defo1` / `aq_momo1` / `aq_teto1` は後から足したもの。新評価版へコピーすると Synthe できる（3つとも works）。[survey-talk2-phonts.md](./survey-talk2-phonts.md)

調査 2 の Mac AT1 リンク試験は [survey-maquestalk1.md](./survey-maquestalk1.md)。AT1 直呼びは [survey-at1-direct.md](./survey-at1-direct.md)。小さい調査は済んだ。アプリ全体が要る調査は LATER。

## これからやること

正本: [upcoming-work.md](./upcoming-work.md)

**NOW（調査）:** 残り無し。`secret` / koffi / remote 棚卸しは実施済み。[survey-small-pass.md](./survey-small-pass.md)。AqKanji2Koe Convert も実施済み（**works**）。[survey-aqkanji2koe.md](./survey-aqkanji2koe.md)。AT1 直呼びも実施済み（できる。CLI 不要）。[survey-at1-direct.md](./survey-at1-direct.md)

**THEN（調査のあと。cc-sdd の仕様 → 実装）**

正本は [upcoming-work.md](./upcoming-work.md)。THEN 1 から。

**見分け:** THEN 1=ファイル投入。THEN 2 と THEN 3=アプリコード。THEN 3≠ライブラリ更新（それは THEN 9）。アプリは `vendor/` を読むので、vendor 更新が先。

- **THEN 1. ファイル。** `myukkurivoice-vendor`（評価版 SDK、AT1 の声種 dylib、`secret` の arm64、talk2 の追加 3 phont。`maquestalk1` / `maquestalk1-ios` のバイナリは入れない）
- **THEN 2. talk1 の呼び方（アプリコード）。** `maquestalk1` / `maquestalk1-ios` の外部コマンドを捨てる。vendor の AT1 dylib をプロセス内で直呼びする。CLI は書き直さない
- **THEN 3. FFI の道具（アプリコード）。** AT2 / AT10 / AqKanji2Koe の `ffi-napi` を `koffi` に替える。vendor の差し替えではない。ライブラリ更新でもない。talk1 は THEN 2 で既に koffi なら、ここでは触らない
- **THEN 4.** `electron.remote` を `@electron/remote` に置き換え
- **THEN 5.** Electron / Node 更新（Node は Electron 同梱。Electron 6 のままにしない）
- **THEN 6.** arm64 パッケージング・署名・公証・MAS
- **THEN 7.** テスト（Playwright 化は許可が必要）
- **THEN 8.** CI
- **THEN 9.** 独立ライブラリ（1件ずつ。ライブラリ更新はここ。THEN 3 ではない）

**LATER:** 公証できる Electron をアプリごとパッケージして決める。本番 renderer の FFI。本番 MAS / 署名。Playwright 移行そのもの。

次の cc-sdd コマンドは決まっていない。THEN 1（ファイル投入。`myukkurivoice-vendor`。アプリは `vendor/` を読むのでアプリコードより先）は将来の作業。アクティブな spec は無い。feature 名は taku-o が `/kiro-spec-requirements` を出すときに決める。cc-sdd の順は [cc-sdd-adoption.md](./cc-sdd-adoption.md)。コマンド名で呼ぶ。各コマンドのあと taku-o 待ち。`/kiro-spec-init` は使わない。Cursor は製品実装を始めない。実装を頼まれたら引き渡しパック（パス、feature 名、task number、spec ファイル、制約）を作る。

## 読むファイル

| ファイル | 内容 |
| --- | --- |
| `.kiro/specs/00-planing/resume.md` | 再開入口（正本） |
| `.kiro/specs/00-planing/planning.md` | 計画の本体 |
| `.kiro/specs/00-planing/prompt.md` | ユーザー発言の抜き出し |
| `.kiro/steering/product.md` / `tech.md` / `structure.md` | 製品・技術・構成の記憶 |
| `.cursor/rules/cursor-local.mdc` | 作業ルール（完了表現禁止など）。ブランチにある |
| `docs/development.md` | vendor 構成、関連リポジトリ |
| Project store `docs/cc-sdd-adoption.md` | これからは cc-sdd。コマンド名が正本（init なし、1つずつ止まる。Cursor=仕様、Claude Code=`/kiro-review-spec` と実装） |
| Project store `docs/upcoming-work.md` | これからやること（NOW / THEN / LATER） |
| Project store `docs/survey-small-pass.md` | 小さい調査（secret / koffi / remote 棚卸し） |
| Project store `docs/sdk-inventory.md` | 評価版 SDK のディスク上の中身（調査 1） |
| Project store `docs/survey-maquestalk1.md` | Mac AT1 で iOS bridge を置き換えられるか（調査 2 の talk1 部分） |
| Project store `docs/survey-talk2-phonts.md` | 現行の古い 3 phont を新評価版で Synthe できるか |
| Project store `docs/survey-aqkanji2koe.md` | 評価版 AqKanji2Koe Convert スニペット |
| Project store `docs/survey-at1-direct.md` | AT1 を koffi 直呼びできるか。できる。CLI 不要 |
