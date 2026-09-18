# 作業再開メモ

新しい会話でこの作業を続けるときの入口。詳細な方針は `planning.md`。ユーザー発言の履歴は `prompt.md`。

**今の段階:** 実装には入っていない。小さい調査は済んだ。アクティブな spec は無い。THEN 1（`maquestalk1` を捨てて AT1 を koffi 直呼び）は将来の作業。`requirements.md` / `design.md` / `tasks.md` / `spec.json` はまだ無い。`/kiro-spec-init` は使わない。工程は1つずつ。taku-o が次を言うまで止まる。正本は Project store `docs/cc-sdd-adoption.md`。

**誰がやるか（2026-09-19）:** Cursor は進捗・仕様・引き渡し（工程 1–6）。製品実装は Claude Code（工程 7–9）。Cursor は製品実装を始めない。`/kiro-review-spec` と `/kiro-review-feature` は Claude Code 専用。Cursor では動かない。実装を頼まれたら Cursor は引き渡しパック（パス、feature 名、task number、spec ファイル、制約）を作る。

評価版 SDK: `~/Desktop/myukkurivoice-lib`。形式は dylib。AquesTalk1 は Mac 評価版。iOS は最後の手段。`maquestalk1` は `Synthe_Utf8` + 声種 dylib が要る。

## 新しい会話の始め方

1. このファイルと `planning.md` を読む。短い作業順は Project store `docs/upcoming-work.md`。工程表は `docs/cc-sdd-adoption.md`
2. ブランチが `feature/applecpu/master` か確認する
3. **開発の前に調査する。** アプリ全体を作らないと確かめられない調査は後回し
4. ユーザーの次の指示を待つ。指示なしに実装や要件定義を始めない。Cursor は製品実装を始めない。実装は Claude Code

再開の指示例:

- 「小さい調査を続けて」→ NOW は済んでいる。記録は Project store `docs/upcoming-work.md`
- 「maquestalk1 を直して」→ しない。THEN 1 は CLI を捨てて koffi 直呼び（将来の作業。アクティブな spec は無い）
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
- `maquestalk1` は自作 CLI。新版は `AquesTalk_Synthe_Utf8` + 声種ごとの dylib。`maquestalk1-ios` は今は使わない。`secret` も自作。FFI ではない外部コマンド
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
- ブランチ: `feature/applecpu/master`（origin に push 済み。先端は `6c2ea99` の想定。再開時に `git log -1` で確認）

Desktop に clone 済み（作業が必要になったら使う。今はいずれも `master`。作業時に `feature/applecpu/master` を切る）:

| パス | リポジトリ | 役割 |
| --- | --- | --- |
| `/Users/taku-o/Desktop/myukkurivoice-vendor` | myukkurivoice/myukkurivoice-vendor | vendor submodule の実体 |
| `/Users/taku-o/Desktop/maquestalk1` | taku-o/maquestalk1 | AquesTalk1 Mac 用 CLI（Xcode）。新版では捨てる |
| `/Users/taku-o/Desktop/maquestalk1-ios` | taku-o/maquestalk1-ios | 今は使わない（最後の手段） |
| `/Users/taku-o/Desktop/myukkurivoice-secret` | myukkurivoice/myukkurivoice-secret | ライセンスキー取得 CLI（Go） |
| `/Users/taku-o/Desktop/myukkurivoice-lib` | （git に入れない） | 評価版 SDK。dylib |

GitHub 操作は `taku-o`（mail@nanasi.jp）アカウント。`git-switch-account show` で確認してから commit / push。

コミットはユーザーが明示したときだけ。push も明示したときだけ。

## 実装の順番（調査のあと。THEN）

1. `maquestalk1` / `maquestalk1-ios` を捨てて、AT1 を AT2 / AT10 と同じ koffi 直呼びに載せる（CLI は書き直さない）
2. `myukkurivoice-vendor`（評価版 SDK、AT1 の声種 dylib、`secret`、talk2 追加 3 phont。`maquestalk1` バイナリは入れない）
3. FFI 置き換え（koffi。talk1 も含む）
4. `electron.remote` を `@electron/remote` に置き換え
5. Electron / Node 更新
6. arm64 パッケージング・署名・公証・MAS
7. テスト（Playwright 化は許可が必要）
8. CI
9. 独立ライブラリ（1件ずつ）

各スペックの cc-sdd 順（飛ばさない。各工程のあと taku-o 待ち）: requirements → gap → design → design 検証 → tasks → 人間レビュー（ここまで Cursor）→ 1タスク実装 → その検証 → 実装確認（ここから Claude Code）。正本は Project store `docs/cc-sdd-adoption.md`。Cursor は製品実装を始めない。

## 次にやること（止まっている地点）

計画は `planning.md`。短い順は Project store `docs/upcoming-work.md`。**実装の入口ではない。** 開発の前に調査する。アプリ全体が要る調査は後回し。

**NOW（小さい調査）**

1. `myukkurivoice-secret` の arm64 `go build`（SDK 非依存）
2. 評価版 dylib を koffi（または同等）で Synthe / FreeWave（`/tmp` のみ。AT2 と/または AT10、AT1 f1）
3. 現行 `electron.remote` の棚卸し（上げない）

**THEN（調査のあと。cc-sdd の仕様 → 実装）**

`maquestalk1` を捨てて AT1 を koffi 直呼び → vendor（talk2 追加 3 phont 含む。CLI は入れない）→ FFI koffi → `@electron/remote` → Electron / Node → arm64 パッケージ・署名・公証・MAS → テスト（Playwright は許可が必要）→ CI → 独立ライブラリ 1 件ずつ

THEN 1 は将来の作業。アクティブな spec は無い。始めるときは taku-o が `/kiro-spec-requirements {feature}` を出す（Cursor）。実装は Claude Code。`/kiro-spec-init` は使わない。

**LATER（今はやらない）**

公証できる Electron をアプリごとパッケージして決める。本番 renderer の中だけで分かる FFI。本番 MAS / 署名。Playwright 移行そのもの。

評価版の場所は分かっている: `~/Desktop/myukkurivoice-lib`

調査結果が出るまで、スペック分割は確定しない。feature 名も taku-o が工程 1 を出すまで決めない。

## やってはいけないこと

- `/kiro-spec-init` を使う。`at1-koffi-direct` を再作成する
- Cursor で製品実装を始める。Cursor で `/kiro-impl` を走らせる
- Cursor で `/kiro-review-spec` / `/kiro-review-feature` が動くと装う（Claude Code 専用）
- ユーザーの明示なしに `requirements.md` / `design.md` / `tasks.md` / `spec.json` を新規作成する
- `spec.json` の `approved` を自己判断で `true` にする
- `-y` を付ける。工程をまとめて進める
- Angular 置き換え、preload 全面移行、Universal Binary、Rosetta 前提の回避
- 評価版 SDK を配布物に入れる
- 一括 sed / 一括ライブラリ更新
- テストコードの無許可変更
- 干渉したライブラリを黙って戻す・コメントアウトして「対応」とする
- 一時実装やダミーで「実装した」ことにする

## 読むファイル

| ファイル | 内容 |
| --- | --- |
| `.kiro/specs/00-planing/resume.md` | このファイル。再開入口 |
| `.kiro/specs/00-planing/planning.md` | 計画の本体 |
| `.kiro/specs/00-planing/prompt.md` | ユーザー発言の抜き出し |
| `.kiro/specs/00-planing/initial-setup.md` | ブランチ作成と kiro 導入コマンド |
| `.kiro/steering/product.md` / `tech.md` / `structure.md` | プロジェクト記憶 |
| `.cursor/rules/cursor-local.mdc` | 作業ルール（完了表現禁止など） |
| `docs/development.md` | vendor 構成、関連リポジトリ |
| Project store `docs/cc-sdd-adoption.md` | cc-sdd の工程表の正本（init なし、1つずつ止まる。Cursor=1–6、Claude Code=7–9） |
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
| `cc-sdd-adoption.md` | cc-sdd の工程表 |
| `apple-cpu-plan.md` | 残作業プラン |
| `sdk-inventory.md` | 評価版 SDK の棚卸し |
| `survey-small-pass.md` | 小さい調査パス（NOW） |
| `survey-at1-direct.md` | AT1 を koffi 直呼びできるか |
| `survey-maquestalk1.md` | Mac AT1 で iOS bridge を置き換えられるか |
| `survey-aqkanji2koe.md` | AqKanji2Koe Convert の調査 |
| `survey-talk2-phonts.md` | 古い talk2 3 phont の Synthe 結果 |
