# このプロジェクトの cc-sdd

taku-o 向け。実装はしていない。アクティブな spec は無い。

**1行:** コマンドは1つずつ。taku-o が次を言うまで止まる。Cursor は進捗管理と仕様の決定。cc-sdd コマンドと実装の実行は Claude Code。

**番号の見分け（混ぜない）**

| 呼び方 | 中身 |
| --- | --- |
| **THEN 1–9** | 製品の作業順。1 vendor ファイル、2 talk1 CLI→dylib、3 ffi-napi→koffi、4 `@electron/remote`、5 Electron/Node（Node は Electron 同梱）、6 パッケージ、**7 テスト**、8 CI、9 独立ライブラリ |
| **cc-sdd** | 下のコマンド名で呼ぶ。番号を THEN と共有しない |

THEN 7 はテスト。実装コマンドは `/kiro-impl`。

## 決定

これからは **cc-sdd** で進める。Kiro スタイル。別プロセスは作らない。

`/kiro-spec-init` は **使わない**。箱（`spec.json`）を先に作らない。

## 誰がやるか（2026-09-19）

**1行:** Cursor は進捗管理と仕様の決定。製品実装と cc-sdd コマンドの実行は Claude Code。

仕様の決定は Cursor。`/kiro-spec-requirements` … `/kiro-spec-tasks` の実行は Claude Code。

理由: Cursor の使用量では足りない。Cursor のレビュースキルは Claude Code ほど揃っていない。

| 担当 | やること |
| --- | --- |
| **Cursor** | 全体の進捗。仕様の決定（次に何をするか、仕様が正しいか、いつ進めるか） |
| **Claude Code** | `/kiro-spec-requirements` … `/kiro-spec-tasks`。`/kiro-review-spec`。製品の実装・検証・実装レビュー（`/kiro-impl` 以降） |

仕様の決定（次に何をするか、仕様が正しいか、いつ進めるか）は Cursor の範囲。Claude Code はそこを Cursor なしで進めない。

`{feature}` と `{task_number}` は、taku-o がそのとき指定する。エージェントは推測しない。

## cc-sdd の順（この順だけ。飛ばさない）

各行のあとで **止まる。** 次は taku-o が出す。`-y` は付けない。`spec.json` の `approved` は自分で立てない。**この表に THEN 番号は付けない。**

| コマンド / 作業 | 何をする | 担当 |
| --- | --- | --- |
| `/kiro-spec-requirements {feature}` | 要件を書く | Claude Code |
| `/kiro-validate-gap {feature}` | 既存コードとの隙間を見る | Claude Code |
| `/kiro-spec-design {feature}` | 設計を書く | Claude Code |
| `/kiro-validate-design {feature}` | 設計をレビューする | Claude Code |
| `/kiro-spec-tasks {feature}` | タスクを切る | Claude Code |
| `/kiro-review-spec {feature}` | requirements / design / tasks を見る | Claude Code（人間レビューではない） |
| `/kiro-impl {feature} {task_number}` | **1タスクだけ**実装する | Claude Code |
| `/kiro-validate-impl {feature} {task_number}` | その1タスクを検証する | Claude Code |
| `/kiro-review-feature` / `/code-review` | 実装の中身を見る | Claude Code |

実装は `/kiro-impl` → `/kiro-validate-impl` → `/kiro-review-feature` を **タスク1件ずつ**繰り返す。全部まとめて `/kiro-impl {feature}` しない。繰り返すのも Claude Code。

`/kiro-review-spec` は Claude Code（`.claude/commands/kiro-review-spec.md`）。人間が requirements / design / tasks を見る工程としては書かない。taku-o は各コマンドのあと次を出す。

`/kiro-review-feature` と `/code-review` も Claude Code。`.cursor/skills/kiro-review` は別物（実装タスクの敵対レビュー用）。`/kiro-review-feature` ではない。

## 使わない

- `/kiro-spec-init`（箱を先に作らない）
- `-y`（自動承認しない）
- `/kiro-spec-quick --auto`
- `spec.json` の `approved` をエージェントが `true` にする
- `at1-koffi-direct` の再作成（削除済み。戻さない。アクティブな spec ではない）
- 指示なしに `requirements.md` / `design.md` / `tasks.md` / `spec.json` を新規作成する
- cc-sdd コマンドをまとめて進める（`/kiro-spec-requirements` のあと `/kiro-validate-gap` を自分で続けない）

スキル本体には `-y` や前工程の auto-approve がある。**このプロジェクトでは使わない。** taku-o のこの順が勝つ。

## スキルの場所

単一の `cc-sdd/SKILL.md` は無い。コマンド名は `/kiro-...`。

**Claude Code**

- `/Users/taku-o/Desktop/myukkurivoice/.claude/skills/kiro-*/SKILL.md`
- `/Users/taku-o/Desktop/myukkurivoice/.claude/commands/kiro-review-spec.md` — `/kiro-review-spec`
- `/Users/taku-o/Desktop/myukkurivoice/.claude/commands/kiro-review-feature.md` — `/kiro-review-feature`
- `/code-review` — Claude Code 側。リポジトリに `.claude/commands/code-review.md` は今ない

**承認ゲート**

- `/Users/taku-o/Desktop/myukkurivoice/.claude/skills/prevent-cc-sdd-auto-progress/SKILL.md`
- taku-o が次を出すまで `spec.json` の `approved` は触らない
- 指示なしに `requirements.md` / `design.md` / `tasks.md` を新規作成しない

この順に入れない:

- `kiro-spec-init` — **使わない**
- `kiro-discovery` — この順に無い。出ない
- `kiro-spec-quick` — 使わない
- `kiro-spec-batch` — 使わない
- `kiro-spec-status` — 進捗確認。次のコマンドを進めない

## いまの位置

調査は cc-sdd の外で済んだ。アクティブな spec は無い。仕様フェーズには入っていない。次の cc-sdd コマンドは出していない。

製品実装には入っていない。実装は Claude Code。

| cc-sdd | このプロジェクト |
| --- | --- |
| Phase 0 ステアリング | ある。`.kiro/steering/` の `product.md` / `tech.md` / `structure.md` |
| Discovery / spec-init | **使わない。** 箱は作らない |
| 調査（スキル外） | 済んだ。下の表 |
| `/kiro-spec-requirements` … `/kiro-spec-tasks` | まだ。taku-o が `/kiro-spec-requirements` を出すまで動かない。担当は Claude Code |
| `/kiro-review-spec` と `/kiro-impl` 以降 | まだ。担当は Claude Code |

済んだ調査:

- SDK 棚卸し
- Mac AT1 リンク試験
- talk2 古い 3 phont
- `secret` arm64 `go build`
- koffi 最小 Synthe / FreeWave
- `electron.remote` 棚卸し
- AqKanji2Koe Convert
- AT1 直呼び（できる。CLI 不要）

**THEN 1（vendor ファイル。cc-sdd の spec ではない）**

`myukkurivoice-vendor` を更新する。評価版 SDK、AT1 の声種 dylib、`secret` の arm64、talk2 の追加 3 phont。`maquestalk1` / `maquestalk1-ios` のバイナリは入れない。アプリは `vendor/` を読むので、アプリコードより先。作業記録は `.kiro/specs/01-vendor-updates/`。このタスクでは `/kiro-*` を走らせない。ファイル投入はまだ。

**THEN 2（THEN 1 のあと）アプリコード。talk1 の呼び方**

`maquestalk1` と `maquestalk1-ios` の外部コマンドを捨てる。vendor の AT1 dylib をプロセス内で直呼びする。CLI は書き直さない。

**THEN 3（THEN 2 のあと）アプリコード。FFI の道具。ライブラリ更新ではない**

AT2 / AT10 / AqKanji2Koe の `ffi-napi` を `koffi` に替える。vendor の差し替えではない。talk1 は THEN 2 で既に koffi なら、ここでは触らない。ライブラリ更新は THEN 9。THEN 4 以降は [upcoming-work.md](./upcoming-work.md)。

アクティブな spec ディレクトリは無い。feature 名は taku-o が `/kiro-spec-requirements` を出すときに決める。実行は Claude Code。`01-vendor-updates` を spec にしない。

## 次のコマンド

決まっていない。taku-o 待ち。

出さない:

- `/kiro-spec-init`
- `/kiro-spec-init at1-koffi-direct`
- `.kiro/specs/at1-koffi-direct/` の再作成（削除済み）

THEN 1 の vendor ファイルは、taku-o が Claude Code に THEN 1 を出したとき。入口は `.kiro/specs/01-vendor-updates/`。`/kiro-spec-requirements` ではない。

cc-sdd の `/kiro-spec-requirements {feature}` は、taku-o がそのコマンドを出したとき。名前はそのとき。出す先は Claude Code。

`00-planing` を spec にしない。計画メモのまま置く。`.kiro/steering/roadmap.md` は作っていない。

## この作業で作っていないもの

次は作っていない。

- `requirements.md`
- `design.md`
- `tasks.md`
- `spec.json`
- `.kiro/steering/roadmap.md`
- `.kiro/specs/at1-koffi-direct/`
