# 作業再開メモ

新しい会話でこの作業を続けるときの入口。詳細な方針は `planning.md`。ユーザー発言の履歴は `prompt.md`。

**番号の見分け（混ぜない）**

| 呼び方 | 中身 |
| --- | --- |
| **THEN 1–9** | 製品の作業順。1 vendor ファイル、2 talk1 CLI→dylib、3 ffi-napi→koffi、4 `@electron/remote`、5 Electron/Node（Node は Electron 同梱）、6 パッケージ、**7 テスト**、8 CI、9 独立ライブラリ |
| **cc-sdd** | コマンド名で呼ぶ。番号を THEN と共有しない |

- Cursor: 進捗管理・仕様の決定（次に何をするか、仕様が正しいか、いつ進めるか）
- Claude Code: `/kiro-spec-requirements` → `/kiro-validate-gap` → `/kiro-spec-design` → `/kiro-validate-design` → `/kiro-spec-tasks` → `/kiro-review-spec` → `/kiro-impl` → `/kiro-validate-impl` → `/kiro-review-feature` / `/code-review`

THEN 7 はテスト。実装コマンドは `/kiro-impl`。

**今の段階:** 製品実装には入っていない。小さい調査は済んだ。アクティブな spec は無い。THEN 1 は vendor ファイル（`myukkurivoice-vendor`。アプリは `vendor/` を読むのでアプリコードより先）。作業記録は `.kiro/specs/01-vendor-updates/`。ファイル投入はまだ。`requirements.md` / `design.md` / `tasks.md` / `spec.json` はまだ無い。`/kiro-spec-init` は使わない。コマンドは1つずつ。taku-o が次を言うまで止まる。cc-sdd は [cc-sdd-adoption.md](./cc-sdd-adoption.md)。

**誰がやるか（2026-09-19）:** Cursor は進捗管理と仕様の決定。`/kiro-spec-requirements` … `/kiro-spec-tasks` の実行は Claude Code。製品実装は Claude Code（`/kiro-impl` 以降）。`/kiro-review-spec` と `/kiro-review-feature` は Claude Code。

評価版 SDK: `~/Desktop/myukkurivoice-lib`。形式は dylib。AquesTalk1 は Mac 評価版。iOS は最後の手段。`maquestalk1` は書き直さない。捨てる。

## 新しい会話の始め方

1. このファイルと `planning.md` を読む。短い作業順は [upcoming-work.md](./upcoming-work.md)。cc-sdd は [cc-sdd-adoption.md](./cc-sdd-adoption.md)
2. 本体の作業ブランチが `feature/applecpu/vender-updates` か確認する（起点は `feature/applecpu/master`）
3. **開発の前に調査する。** アプリ全体を作らないと確かめられない調査は後回し
4. ユーザーの次の指示を待つ。指示なしに実装や要件定義を始めない。実装は Claude Code

再開の指示例:

- 「小さい調査を続けて」→ NOW は済んでいる。記録は [upcoming-work.md](./upcoming-work.md)
- 「maquestalk1 を直して」→ しない。CLI は捨てる。捨てるのは THEN 2（THEN 1 の vendor のあと）
- 「要件定義を作って」→ そのとき初めて `requirements.md` を作る。入口は `/kiro-spec-requirements {feature}`（feature 名はそのとき。実行は Claude Code）。`/kiro-spec-init` は使わない。`at1-koffi-direct` は再作成しない
- 「THEN 1」→ vendor ファイル。`.kiro/specs/01-vendor-updates/`。このタスクでは `/kiro-*` を走らせない

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
- 作業ブランチ名の揃え方: 本体 `myukkurivoice` に合わせる。計画の起点は **`feature/applecpu/master`**
- THEN 1 の本体作業ブランチは **`feature/applecpu/vender-updates`**（綴りは vender。起点 `feature/applecpu/master`）
- vendor clone の THEN 1 ブランチは **`feature/applecpu/master`**
- `develop` / `master` 上では直接作業しない
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
- 計画の起点ブランチ: `feature/applecpu/master`（origin にあり。計画ドキュメントの先端は `ba8280d`。再開時に `git log -1`）
- THEN 1 作業ブランチ: `feature/applecpu/vender-updates`（起点は上。ローカル）

Desktop に clone 済み:

| パス | リポジトリ | 役割 |
| --- | --- | --- |
| `/Users/taku-o/Desktop/myukkurivoice-vendor` | myukkurivoice/myukkurivoice-vendor | vendor submodule の実体。THEN 1 ブランチ `feature/applecpu/master` |
| `/Users/taku-o/Desktop/maquestalk1` | myukkurivoice/maquestalk1 | AquesTalk1 Mac 用 CLI（Xcode）。新版では捨てる（書き直さない） |
| `/Users/taku-o/Desktop/maquestalk1-ios` | myukkurivoice/maquestalk1-ios | 今は使わない（最後の手段） |
| `/Users/taku-o/Desktop/myukkurivoice-secret` | myukkurivoice/myukkurivoice-secret | ライセンスキー取得 CLI（Go） |
| `/Users/taku-o/Desktop/myukkurivoice-lib` | （git に入れない） | 評価版 SDK。dylib |

GitHub 操作は `taku-o`（mail@nanasi.jp）アカウント。`git-switch-account show` で確認してから commit / push。

コミットはユーザーが明示したときだけ。push も明示したときだけ。

## 実装の順番（調査のあと。THEN）

正本は [upcoming-work.md](./upcoming-work.md)。

**見分け:** THEN 1=ファイル投入。THEN 2 と THEN 3=アプリコード。THEN 3≠ライブラリ更新（それは THEN 9）。アプリは `vendor/` を読むので、vendor 更新が先。

各スペックの cc-sdd 順（飛ばさない。各コマンドのあと taku-o 待ち。**番号は付けない**）: `/kiro-spec-requirements` → `/kiro-validate-gap` → `/kiro-spec-design` → `/kiro-validate-design` → `/kiro-spec-tasks` → `/kiro-review-spec` → `/kiro-impl`（1タスク）→ `/kiro-validate-impl` → `/kiro-review-feature` / `/code-review`（Claude Code。人間レビューではない）。正本は [cc-sdd-adoption.md](./cc-sdd-adoption.md)。

## 次にやること（止まっている地点）

計画は `planning.md`。短い順は [upcoming-work.md](./upcoming-work.md)。**実装の入口ではない。** 開発の前に調査する。アプリ全体が要る調査は後回し。

**NOW（小さい調査）** — **残り無し。** 実施済み。記録は [survey-small-pass.md](./survey-small-pass.md) / [survey-aqkanji2koe.md](./survey-aqkanji2koe.md) / [survey-at1-direct.md](./survey-at1-direct.md)

**THEN（調査のあと）**

THEN 1 ファイル投入 → THEN 2 アプリ talk1 呼び方 → THEN 3 アプリ FFI 道具（ライブラリ更新ではない）→ THEN 4 `@electron/remote` → THEN 5 Electron / Node → THEN 6 arm64 パッケージ・署名・公証・MAS → THEN 7 テスト（Playwright は許可が必要）→ THEN 8 CI → THEN 9 独立ライブラリ 1 件ずつ（ここがライブラリ更新）

THEN 1 は vendor ファイル。作業記録は `.kiro/specs/01-vendor-updates/`。このタスクでは `/kiro-*` を走らせない。アクティブな spec は無い。cc-sdd を始めるときは taku-o が `/kiro-spec-requirements {feature}` を出す（Claude Code）。`/kiro-spec-init` は使わない。

**LATER（今はやらない）**

公証できる Electron をアプリごとパッケージして決める。本番 renderer の中だけで分かる FFI。本番 MAS / 署名。Playwright 移行そのもの。

評価版の場所は分かっている: `~/Desktop/myukkurivoice-lib`

調査結果が出るまで、スペック分割は確定しない。feature 名も taku-o が `/kiro-spec-requirements` を出すまで決めない。

## やってはいけないこと

- `/kiro-spec-init` を使う。`at1-koffi-direct` を再作成する
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
| `.kiro/specs/00-planing/upcoming-work.md` | これからやること（NOW / THEN / LATER） |
| `.kiro/specs/00-planing/cc-sdd-adoption.md` | cc-sdd の順（コマンド名。Cursor=進捗・仕様の決定、Claude Code=`/kiro-spec-requirements` … `/kiro-spec-tasks` と実装） |
| `.kiro/specs/00-planing/project-context.md` | プロジェクト文脈 |
| `.kiro/specs/00-planing/apple-cpu-plan.md` | 残作業プラン |
| `.kiro/specs/00-planing/sdk-inventory.md` | 評価版 SDK の棚卸し |
| `.kiro/specs/00-planing/survey-small-pass.md` | 小さい調査パス（NOW） |
| `.kiro/specs/00-planing/survey-at1-direct.md` | AT1 を koffi 直呼びできるか |
| `.kiro/specs/00-planing/survey-maquestalk1.md` | Mac AT1 で iOS bridge を置き換えられるか |
| `.kiro/specs/00-planing/survey-aqkanji2koe.md` | AqKanji2Koe Convert の調査 |
| `.kiro/specs/00-planing/survey-talk2-phonts.md` | 古い talk2 3 phont の Synthe 結果 |
| `.kiro/specs/01-vendor-updates/` | THEN 1 の作業記録と引き渡し |
| `.kiro/steering/product.md` / `tech.md` / `structure.md` | プロジェクト記憶 |
| `.cursor/rules/cursor-local.mdc` | 作業ルール（完了表現禁止など）。ブランチにある |
| `docs/development.md` | vendor 構成、関連リポジトリ |

## このフォルダのファイル

- `planning.md` — 計画
- `prompt.md` — 会話で出た指示のメモ
- `initial-setup.md` — 初期コマンド
- `resume.md` — 再開用（本ファイル）
- `upcoming-work.md` / `cc-sdd-adoption.md` / `project-context.md` / `apple-cpu-plan.md` — 作業順と進め方
- `sdk-inventory.md` と `survey-*.md` — 調査
