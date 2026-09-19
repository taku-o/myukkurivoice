# 作業再開メモ

新しい会話でこの作業を続けるときの入口。詳細な方針は `planning.md`。ユーザー発言の履歴は `prompt.md`。

**番号の見分け（混ぜない）**

| 呼び方 | 中身 |
| --- | --- |
| **THEN 1–9** | 製品の作業順。1 vendor ファイル、2 talk1 CLI→dylib、3 ffi-napi→koffi、4 `@electron/remote`、5 Electron/Node（Node は Electron 同梱）、6 パッケージ、**7 テスト**、8 CI、9 独立ライブラリ |
| **cc-sdd** | コマンド名で呼ぶ。番号を THEN と共有しない |

- Cursor: `/kiro-spec-requirements` → `/kiro-validate-gap` → `/kiro-spec-design` → `/kiro-validate-design` → `/kiro-spec-tasks`
- Claude Code: `/kiro-review-spec` → `/kiro-impl` → `/kiro-validate-impl` → `/kiro-review-feature` / `/code-review`
- 裸の「工程 7」は使わない（THEN 7=テスト、`/kiro-impl` と衝突する）

**今の段階:** 実装には入っていない。小さい調査は済んだ。アクティブな spec は無い。THEN 1（ファイル投入。`myukkurivoice-vendor`。アプリは `vendor/` を読むのでアプリコードより先）は将来の作業。`requirements.md` / `design.md` / `tasks.md` / `spec.json` はまだ無い。`/kiro-spec-init` は使わない。コマンドは1つずつ。taku-o が次を言うまで止まる。正本は Project store `docs/cc-sdd-adoption.md`。

**誰がやるか（2026-09-19）:** Cursor は進捗・仕様・引き渡し（`/kiro-spec-requirements` … `/kiro-spec-tasks`）。製品実装は Claude Code（`/kiro-impl` 以降）。`/kiro-review-spec` と `/kiro-review-feature` は Claude Code 専用。Cursor では動かない。実装を頼まれたら Cursor は引き渡しパック（パス、feature 名、task number、spec ファイル、制約）を作る。

評価版 SDK: `~/Desktop/myukkurivoice-lib`。形式は dylib。AquesTalk1 は Mac 評価版。iOS は最後の手段。`maquestalk1` は書き直さない。捨てる。

## 新しい会話の始め方

1. このファイルと `planning.md` を読む。短い作業順は Project store `docs/upcoming-work.md`。cc-sdd は `docs/cc-sdd-adoption.md`
2. ブランチが `feature/applecpu/master` か確認する
3. **開発の前に調査する。** アプリ全体を作らないと確かめられない調査は後回し
4. ユーザーの次の指示を待つ。指示なしに実装や要件定義を始めない。Cursor は製品実装を始めない。実装は Claude Code

再開の指示例:

- 「小さい調査を続けて」→ NOW は済んでいる。記録は Project store `docs/upcoming-work.md`
- 「maquestalk1 を直して」→ しない。CLI は捨てる。捨てるのは THEN 2（THEN 1 の vendor のあと）
- 「要件定義を作って」→ そのとき初めて `requirements.md` を作る。入口は `/kiro-spec-requirements {feature}`（feature 名はそのとき）。`/kiro-spec-init` は使わない。`at1-koffi-direct` は再作成しない

## 何の作業か

MYukkuriVoice を **Apple Silicon（arm64）専用** にし、必要な範囲で古いライブラリを上げる。Intel / Universal / Rosetta は対象外。AngularJS 1.x は置き換えない。

## 確定している方針

- 最新版アプリは arm64 のみ
- AngularJS 1.x、`nodeIntegration: true` は維持。preload 全面移行はしない
- ドキュメントにない機能は作らない。最適化・フォールバックは入れない
- AquesTalk 現行 vendor に arm64 は無い。開発はアクエストの **評価版 SDK** を使う。置き場 `~/Desktop/myukkurivoice-lib`。形式は **dylib**。評価版の再配布はしない。有償ライセンスは評価版で足りないと分かってから決める
- **AquesTalk1 は Mac 評価版。** iOS は最後の手段。iOS SDK は今は取らない
- `vendor/` は自作 submodule `myukkurivoice-vendor`。アクエスト製ライブラリと自作 CLI をまとめる場所
- `maquestalk1` は自作 CLI。新版では捨てる（書き直さない）。AT1 は koffi 直呼び。`maquestalk1-ios` は今は使わない。`secret` も自作。残す
- 独立ライブラリ: 同じメジャーは上げる。メジャーが飛ぶものは可能なら上げる。干渉したら黙って戻さず報告する
- `intro.js` は 8.x へ上げ、既存チュートリアル UI の変更も試みる。新しいステップは足さない。他 UI は多少の変化は許容、大幅な作り直しはしない
- 自前 npm で今すぐ上げられるのは `fcpx-audio-role-encoder` 0.1.2 → 0.1.4 だけ。他の GitHub 直指定パッケージは既に最新タグ
- テストコードは許可なく変更しない。Spectron → Playwright は許可が必要
- 「完了」「complete」等はユーザーの許可なく使わない。完了判定はユーザーがする

## ブランチ規則

自前リポジトリを触るとき:

- 起点: `develop` があればそこ。なければ `master`
- 作業ブランチ名: **`feature/applecpu/master`**（本体に合わせる）
- `develop` / `master` 上では直接作業しない
- 本体 `myukkurivoice` は既に `feature/applecpu/master`。それを継続する
- `staging` は他リポジトリの起点にしない

```
git fetch origin
git switch develop 2>/dev/null || git switch master
git switch -c feature/applecpu/master
```

## リポジトリとローカルパス

本体:

- https://github.com/taku-o/myukkurivoice
- 作業ディレクトリ: `/Users/taku-o/Desktop/myukkurivoice`
- ブランチ: `feature/applecpu/master`（origin に push 済み。確認した先端は `ba8280d`。再開時に `git log -1` で確認）

Desktop に clone 済み（作業が必要になったら使う。今はいずれも `master`。作業時に `feature/applecpu/master` を切る）:

| パス | リポジトリ | 役割 |
| --- | --- | --- |
| `/Users/taku-o/Desktop/myukkurivoice-vendor` | myukkurivoice/myukkurivoice-vendor | vendor submodule の実体 |
| `/Users/taku-o/Desktop/maquestalk1` | myukkurivoice/maquestalk1 | AquesTalk1 Mac 用 CLI（Xcode）。新版では捨てる（書き直さない） |
| `/Users/taku-o/Desktop/maquestalk1-ios` | myukkurivoice/maquestalk1-ios | 今は使わない（最後の手段） |
| `/Users/taku-o/Desktop/myukkurivoice-secret` | myukkurivoice/myukkurivoice-secret | ライセンスキー取得 CLI（Go） |
| `/Users/taku-o/Desktop/myukkurivoice-lib` | （git に入れない） | 評価版 SDK。dylib |

GitHub 操作は `taku-o`（mail@nanasi.jp）アカウント。`git-switch-account show` で確認してから commit / push。

コミットはユーザーが明示したときだけ。push も明示したときだけ。

## 実装の順番（調査のあと。THEN）

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

各スペックの cc-sdd 順（飛ばさない。各コマンドのあと taku-o 待ち。**番号は付けない**）: `/kiro-spec-requirements` → `/kiro-validate-gap` → `/kiro-spec-design` → `/kiro-validate-design` → `/kiro-spec-tasks`（ここまで Cursor）→ `/kiro-review-spec` → `/kiro-impl`（1タスク）→ `/kiro-validate-impl` → `/kiro-review-feature` / `/code-review`（ここから Claude Code。人間レビューではない）。正本は Project store `docs/cc-sdd-adoption.md`。Cursor は製品実装を始めない。

## 次にやること（止まっている地点）

計画は `planning.md`。短い順は Project store `docs/upcoming-work.md`。**実装の入口ではない。** 開発の前に調査する。アプリ全体が要る調査は後回し。

**NOW（小さい調査）** — **残り無し。** 実施済み。記録は Project store `docs/survey-small-pass.md` / `docs/survey-aqkanji2koe.md` / `docs/survey-at1-direct.md`

**THEN（調査のあと。cc-sdd の仕様 → 実装）**

THEN 1 ファイル投入 → THEN 2 アプリ talk1 呼び方 → THEN 3 アプリ FFI 道具（ライブラリ更新ではない）→ THEN 4 `@electron/remote` → THEN 5 Electron / Node → THEN 6 arm64 パッケージ・署名・公証・MAS → THEN 7 テスト（Playwright は許可が必要）→ THEN 8 CI → THEN 9 独立ライブラリ 1 件ずつ（ここがライブラリ更新）

THEN 1 は将来の作業（ファイル投入。vendor 更新。アプリは `vendor/` を読むのでアプリコードより先）。アクティブな spec は無い。始めるときは taku-o が `/kiro-spec-requirements {feature}` を出す（Cursor）。実装は Claude Code。`/kiro-spec-init` は使わない。

**LATER（今はやらない）**

公証できる Electron をアプリごとパッケージして決める。本番 renderer の中だけで分かる FFI。本番 MAS / 署名。Playwright 移行そのもの。

評価版の場所は分かっている: `~/Desktop/myukkurivoice-lib`

調査結果が出るまで、スペック分割は確定しない。feature 名も taku-o が `/kiro-spec-requirements` を出すまで決めない。

## やってはいけないこと

- `/kiro-spec-init` を使う。`at1-koffi-direct` を再作成する
- Cursor で製品実装を始める。Cursor で `/kiro-impl` を走らせる
- Cursor で `/kiro-review-spec` / `/kiro-review-feature` が動くと装う（Claude Code 専用）
- ユーザーの明示なしに `requirements.md` / `design.md` / `tasks.md` / `spec.json` を新規作成する
- `spec.json` の `approved` を自己判断で `true` にする
- `-y` を付ける。cc-sdd コマンドをまとめて進める
- Angular 置き換え、preload 全面移行、Universal Binary、Rosetta 前提の回避
- 評価版 SDK を配布物に入れる
- 一括 sed / 一括ライブラリ更新
- テストコードの無許可変更
- 干渉したライブラリを黙って戻す・コメントアウトして「対応」とする
- 一時実装やダミーで「実装した」ことにする
- `maquestalk1` を新 API 向けに書き直す（捨てる）

## 読むファイル

| ファイル | 内容 |
| --- | --- |
| `.kiro/specs/00-planing/resume.md` | このファイル。再開入口 |
| `.kiro/specs/00-planing/planning.md` | 計画の本体 |
| `.kiro/specs/00-planing/prompt.md` | ユーザー発言の抜き出し |
| `.kiro/specs/00-planing/initial-setup.md` | ブランチ作成と kiro 導入コマンド |
| `.kiro/steering/product.md` / `tech.md` / `structure.md` | プロジェクト記憶 |
| `.cursor/rules/cursor-local.mdc` | 作業ルール（完了表現禁止など）。ブランチにある |
| `docs/development.md` | vendor 構成、関連リポジトリ |
| Project store `docs/cc-sdd-adoption.md` | cc-sdd の正本（init なし、1つずつ止まる。Cursor=仕様、Claude Code=`/kiro-review-spec` と実装） |
| Project store `docs/upcoming-work.md` | これからやること（NOW / THEN / LATER） |
| Project store `docs/survey-talk2-phonts.md` | 古い talk2 3 phont の Synthe 結果 |

## このフォルダのファイル

- `planning.md` — 計画
- `prompt.md` — 会話で出た指示のメモ
- `initial-setup.md` — 初期コマンド
- `resume.md` — 再開用（本ファイル）

## Claude Code 用のコピー（このフォルダ）

Project store `docs/` をここに置いた。Claude Code は **このフォルダのファイル** を読む。`internal/` と `notes.md` は入れてない。

| ファイル | 一言 |
| --- | --- |
| `upcoming-work.md` | これからやること（NOW / THEN / LATER） |
| `project-context.md` | プロジェクト文脈 |
| `cc-sdd-adoption.md` | cc-sdd の順（コマンド名） |
| `apple-cpu-plan.md` | 残作業プラン |
| `sdk-inventory.md` | 評価版 SDK の棚卸し |
| `survey-small-pass.md` | 小さい調査パス（NOW） |
| `survey-at1-direct.md` | AT1 を koffi 直呼びできるか |
| `survey-maquestalk1.md` | Mac AT1 で iOS bridge を置き換えられるか |
| `survey-aqkanji2koe.md` | AqKanji2Koe Convert の調査 |
| `survey-talk2-phonts.md` | 古い talk2 3 phont の Synthe 結果 |
