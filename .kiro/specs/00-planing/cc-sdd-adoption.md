# このプロジェクトの cc-sdd

taku-o 向け。実装はしていない。アクティブな spec は無い。

**1行:** コマンドは1つずつ。taku-o が次を言うまで止まる。Cursor は進捗・仕様・引き渡し。実装は Claude Code。

**番号の見分け（混ぜない）**

| 呼び方 | 中身 |
| --- | --- |
| **THEN 1–9** | 製品の作業順。1 vendor ファイル、2 talk1 CLI→dylib、3 ffi-napi→koffi、4 `@electron/remote`、5 Electron/Node（Node は Electron 同梱）、6 パッケージ、**7 テスト**、8 CI、9 独立ライブラリ |
| **cc-sdd** | 下のコマンド名で呼ぶ。番号を THEN と共有しない |

裸の「工程 7」は使わない。THEN 7 はテスト。実装コマンドは `/kiro-impl`。

## 決定

これからは **cc-sdd** で進める。Kiro スタイル。別プロセスは作らない。

`/kiro-spec-init` は **使わない**。箱（`spec.json`）を先に作らない。

## 誰がやるか（2026-09-19）

**1行:** Cursor は進捗管理・仕様の決定・Claude Code への引き渡し。製品実装は Claude Code。

理由: Cursor の使用量では足りない。Cursor のレビュースキルは Claude Code ほど揃っていない。

| 担当 | やること | やらないこと |
| --- | --- | --- |
| **Cursor** | 全体の進捗。仕様の決定（`/kiro-spec-requirements` … `/kiro-spec-tasks`）。実装を頼まれたら引き渡しパックを作る | 製品実装を始めない。`/kiro-impl` / `/kiro-validate-impl` / `/kiro-review-spec` / `/kiro-review-feature` を走らせない |
| **Claude Code** | `/kiro-review-spec`。製品の実装・検証・実装レビュー（`/kiro-impl` 以降） | Cursor 担当の仕様コマンドの正本を、Cursor なしで進めない（この分担の範囲） |

Cursor は製品実装を始めない。スキルファイルが `.cursor/skills` にあっても、`/kiro-impl` を Cursor で走らせない。

taku-o が「実装して」と言ったとき、Cursor が作る引き渡しパック:

- リポジトリのパス
- feature 名
- task number（1件）
- spec ファイルのパス（`requirements.md` / `design.md` / `tasks.md`）
- このプロジェクトの制約（init なし、`-y` なし、1タスクだけ、など）

頼まれるまでパックは作らない。

## cc-sdd の順（この順だけ。飛ばさない）

各行のあとで **止まる。** 次は taku-o が出す。`-y` は付けない。`spec.json` の `approved` は自分で立てない。**この表に THEN 番号は付けない。**

| コマンド / 作業 | 何をする | 担当 |
| --- | --- | --- |
| `/kiro-spec-requirements {feature}` | 要件を書く | Cursor |
| `/kiro-validate-gap {feature}` | 既存コードとの隙間を見る | Cursor |
| `/kiro-spec-design {feature}` | 設計を書く | Cursor |
| `/kiro-validate-design {feature}` | 設計をレビューする | Cursor |
| `/kiro-spec-tasks {feature}` | タスクを切る | Cursor |
| `/kiro-review-spec {feature}` | requirements / design / tasks を見る | Claude Code（人間レビューではない。Cursor では動かない） |
| `/kiro-impl {feature} {task_number}` | **1タスクだけ**実装する | Claude Code |
| `/kiro-validate-impl {feature} {task_number}` | その1タスクを検証する | Claude Code |
| `/kiro-review-feature` / `/code-review` | 実装の中身を見る | Claude Code |

`{feature}` と `{task_number}` は、taku-o がそのとき指定する。エージェントは推測しない。

実装は `/kiro-impl` → `/kiro-validate-impl` → `/kiro-review-feature` を **タスク1件ずつ**繰り返す。全部まとめて `/kiro-impl {feature}` しない。繰り返すのも Claude Code。Cursor は次タスクの引き渡しパックだけ用意する（頼まれたとき）。

`/kiro-review-spec` は **Claude Code 専用**（`.claude/commands/kiro-review-spec.md`）。Cursor では動かない。後でコピーするまで Cursor で呼ばない。動かると装わない。人間が requirements / design / tasks を見る工程としては書かない。taku-o は各コマンドのあと次を出す。

`/kiro-review-feature` と `/code-review` も **Claude Code 専用**。Cursor では動かない。動かると装わない。`.cursor/skills/kiro-review` は別物（実装タスクの敵対レビュー用）。`/kiro-review-feature` ではない。

## 使わない

- `/kiro-spec-init`（箱を先に作らない）
- `-y`（自動承認しない）
- `/kiro-spec-quick --auto`
- `spec.json` の `approved` をエージェントが `true` にする
- `at1-koffi-direct` の再作成（削除済み。戻さない。アクティブな spec ではない）
- 指示なしに `requirements.md` / `design.md` / `tasks.md` / `spec.json` を新規作成する
- cc-sdd コマンドをまとめて進める（`/kiro-spec-requirements` のあと `/kiro-validate-gap` を自分で続けない）
- Cursor で製品実装を始める
- Cursor で `/kiro-impl` / `/kiro-validate-impl` を走らせる
- Cursor で `/kiro-review-spec` / `/kiro-review-feature` / `/code-review` が動くと装う
- `.claude/commands` を `.cursor` へ symlink / コピーする（taku-o が言うまで）

スキル本体には `-y` や前工程の auto-approve がある。**このプロジェクトでは使わない。** taku-o のこの順が勝つ。

## スキルの場所

単一の `cc-sdd/SKILL.md` は無い。コマンド名は `/kiro-...`。

**Cursor が読む本体（仕様コマンドで使う）**

- スキル群: `/Users/taku-o/Desktop/myukkurivoice/.cursor/skills/kiro-*/SKILL.md`
- 入口: `/Users/taku-o/Desktop/myukkurivoice/AGENTS.md`

コマンドに対応するスキル:

- `.cursor/skills/kiro-spec-requirements/SKILL.md` — `/kiro-spec-requirements`（Cursor）
- `.cursor/skills/kiro-validate-gap/SKILL.md` — `/kiro-validate-gap`（Cursor）
- `.cursor/skills/kiro-spec-design/SKILL.md` — `/kiro-spec-design`（Cursor）
- `.cursor/skills/kiro-validate-design/SKILL.md` — `/kiro-validate-design`（Cursor）
- `.cursor/skills/kiro-spec-tasks/SKILL.md` — `/kiro-spec-tasks`（Cursor）

**Cursor にあるが、製品実装では使わない（Claude Code）**

- `.cursor/skills/kiro-impl/SKILL.md` — `/kiro-impl`。ファイルはある。Cursor では走らせない
- `.cursor/skills/kiro-validate-impl/SKILL.md` — `/kiro-validate-impl`。ファイルはある。Cursor では走らせない

あるが、このプロジェクトの順には入れない:

- `kiro-spec-init` — **使わない**
- `kiro-discovery` — この順に無い。出ない
- `kiro-spec-quick` — 使わない
- `kiro-spec-batch` — 使わない
- `kiro-spec-status` — 進捗確認。次のコマンドを進めない

**Claude Code だけ（コピーするまで Cursor で呼ばない）**

- `/Users/taku-o/Desktop/myukkurivoice/.claude/commands/kiro-review-spec.md` — `/kiro-review-spec`。Cursor では動かない
- `/Users/taku-o/Desktop/myukkurivoice/.claude/commands/kiro-review-feature.md` — `/kiro-review-feature`。Cursor では動かない
- `/code-review` — Claude Code 側。Cursor では動かない。リポジトリに `.claude/commands/code-review.md` は今ない

**同じパックの Claude Code コピー**

- `/Users/taku-o/Desktop/myukkurivoice/.claude/skills/kiro-*/SKILL.md`

**承認ゲート**

- `/Users/taku-o/Desktop/myukkurivoice/.claude/skills/prevent-cc-sdd-auto-progress/SKILL.md`
- taku-o が次を出すまで `spec.json` の `approved` は触らない
- 指示なしに `requirements.md` / `design.md` / `tasks.md` を新規作成しない

`~/.cursor/skills` と Cursor プラグインには cc-sdd は無かった。

## いまの位置

調査は cc-sdd の外で済んだ。アクティブな spec は無い。仕様フェーズには入っていない。次コマンドは出していない。

Cursor も Claude Code も、製品実装には入っていない。入らない。実装は Claude Code。taku-o が頼むまで引き渡しパックも作らない。

| cc-sdd | このプロジェクト |
| --- | --- |
| Phase 0 ステアリング | ある。`.kiro/steering/` の `product.md` / `tech.md` / `structure.md` |
| Discovery / spec-init | **使わない。** 箱は作らない |
| 調査（スキル外） | 済んだ。下の表 |
| `/kiro-spec-requirements` … `/kiro-spec-tasks` | まだ。taku-o が `/kiro-spec-requirements` を出すまで動かない。担当は Cursor |
| `/kiro-review-spec` と `/kiro-impl` 以降 | まだ。担当は Claude Code。Cursor は始めない |

済んだ調査:

- SDK 棚卸し
- Mac AT1 リンク試験
- talk2 古い 3 phont
- `secret` arm64 `go build`
- koffi 最小 Synthe / FreeWave
- `electron.remote` 棚卸し
- AqKanji2Koe Convert
- AT1 直呼び（できる。CLI 不要）

**THEN 1（将来の仕様の題材。いまは作らない）ファイル投入**

`myukkurivoice-vendor` を更新する。評価版 SDK、AT1 の声種 dylib、`secret` の arm64、talk2 の追加 3 phont。`maquestalk1` / `maquestalk1-ios` のバイナリは入れない。アプリは `vendor/` を読むので、アプリコードより先。

**THEN 2（THEN 1 のあと）アプリコード。talk1 の呼び方**

`maquestalk1` と `maquestalk1-ios` の外部コマンドを捨てる。vendor の AT1 dylib をプロセス内で直呼びする。CLI は書き直さない。

**THEN 3（THEN 2 のあと）アプリコード。FFI の道具。ライブラリ更新ではない**

AT2 / AT10 / AqKanji2Koe の `ffi-napi` を `koffi` に替える。vendor の差し替えではない。talk1 は THEN 2 で既に koffi なら、ここでは触らない。ライブラリ更新は THEN 9。

アクティブな spec ディレクトリは無い。feature 名は taku-o が `/kiro-spec-requirements` を出すときに決める。

## 次のコマンド

決まっていない。taku-o 待ち。

出さない:

- `/kiro-spec-init`
- `/kiro-spec-init at1-koffi-direct`
- `.kiro/specs/at1-koffi-direct/` の再作成（削除済み）
- Cursor からの `/kiro-impl`
- Cursor からの `/kiro-review-spec` / `/kiro-review-feature`（動かない）

THEN 1 を始めるときは、taku-o が `/kiro-spec-requirements {feature}` を出す。名前はそのとき。出す先は Cursor。

`00-planing` を spec にしない。計画メモのまま置く。`.kiro/steering/roadmap.md` は作っていない。

## この作業で作っていないもの

次は作っていない。

- `requirements.md`
- `design.md`
- `tasks.md`
- `spec.json`
- `.kiro/steering/roadmap.md`
- `.kiro/specs/at1-koffi-direct/`
- `.claude/commands` から `.cursor` への symlink / コピー
