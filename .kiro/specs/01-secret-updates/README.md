# THEN 1-1 `myukkurivoice-secret` を arm64 に更新

**このタスクは THEN 1-1 だけ。** `myukkurivoice-secret` を arm64 にする。vendor へ SDK や secret をコピーするのは **次（THEN 1-2）。このタスクではない。**

計画の正本は [../00-planing/](../00-planing/)。とくに [survey-small-pass.md](../00-planing/survey-small-pass.md)。00-planing は読んだ前提。再掲しない。

作業メモは `.kiro/specs/01-secret-updates/` だけ。secret / vendor / maquestalk1 リポジトリへメモを書かない。

観測日: 2026-09-19。secret の製品バイナリはまだ x86_64。この資料を書いた時点では arm64 へ更新していない。

## 作業先（THEN 1-1）

| 項目 | 値 |
| --- | --- |
| リポジトリ | `/Users/taku-o/Desktop/myukkurivoice-secret` |
| ブランチ | `feature/applecpu/master`（ローカル作成済み。起点 `master` `0ae3970` = `origin/master`。origin にこのブランチは無い） |
| ソース | `/Users/taku-o/Desktop/myukkurivoice-secret/src/secret/secret.go` |
| 現行バイナリ | 同ディレクトリの `secret`（**x86_64**。成果物にしない） |
| 成果物 | secret リポジトリ内の Mach-O **arm64**。`lipo -info` で確認する |

本体 `myukkurivoice` の作業記録ブランチは `feature/applecpu/secret-updates`。THEN 1-1 の書き込み先は **Desktop の secret clone**。

関連: [claude-handoff.md](./claude-handoff.md)（やること / やらないこと）、[sources.md](./sources.md)（実測パス）、[secret-first.md](./secret-first.md)（1-1 が先、1-2 が次）。

## 次（このタスクではない）

**THEN 1-2** で `myukkurivoice-vendor` へ評価版 SDK と、更新済み secret の成果物を置く。secret をそこで建て直さない。**今はコピーしない。**

番号 2–9 は動かさない。THEN 7 はテストのまま。
