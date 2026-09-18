# これからやること

taku-o 向け。再開入口はリポジトリの `.kiro/specs/00-planing/resume.md`。詳細は同フォルダの `planning.md`。cc-sdd の使い方は [cc-sdd-adoption.md](./cc-sdd-adoption.md)。

**方針:** これからは **cc-sdd** で進める。工程は1つずつ。taku-o が次を言うまで止まる。調査は済んだ。アクティブな spec は無い。THEN 1（`maquestalk1` を捨てて AT1 を koffi 直呼び）は将来の作業。アプリ全体を作らないと確かめられない調査は後回し。

**誰がやるか（2026-09-19）:** Cursor は進捗・仕様・引き渡し（工程 1–6）。製品実装は Claude Code（工程 7–9）。Cursor は製品実装を始めない。`/kiro-review-spec` と `/kiro-review-feature` は Claude Code 専用。正本は [cc-sdd-adoption.md](./cc-sdd-adoption.md)。

`/kiro-spec-init` は使わない。taku-o が `/kiro-spec-requirements {feature}` を出すまで `requirements.md` / `design.md` / `tasks.md` / `spec.json` は作らない。承認も自分では付けない。SDK バイナリは git / store に入れない。工程表の正本は [cc-sdd-adoption.md](./cc-sdd-adoption.md)。

## いまの位置

実装には入っていない。cc-sdd の仕様フェーズにも入っていない。Cursor で実装しない。実装は Claude Code。頼まれるまで引き渡しパックも作らない。

当初 NOW にした 3 件（`secret` の arm64、評価版の koffi 最小呼び出し、`electron.remote` の棚卸し）は **済んだ**。記録は [survey-small-pass.md](./survey-small-pass.md)。

AqKanji2Koe の Convert スニペットも **済んだ**（**works**）。記録は [survey-aqkanji2koe.md](./survey-aqkanji2koe.md)。

AT1 直呼びも **済んだ**（できる）。記録は [survey-at1-direct.md](./survey-at1-direct.md)。NOW の小さい調査はここまで。アクティブな spec は無い。THEN 1 は将来の作業。`maquestalk1` は直さない。捨てる。

## 済んだ調査

| 何 | 結果 | 詳細 |
| --- | --- | --- |
| SDK 棚卸し | Mac 4 本は arm64 の dylib。`.framework` は無い | [sdk-inventory.md](./sdk-inventory.md) |
| Mac AT1 リンク試験 | SDK は足りる。現行 CLI はそのままでは呼べない | [survey-maquestalk1.md](./survey-maquestalk1.md) |
| talk2 古い 3 phont | 新評価版へコピーすると 3つとも works | [survey-talk2-phonts.md](./survey-talk2-phonts.md) |
| `secret` の arm64 `go build` | `/tmp` で arm64 が建つ。checkout 内バイナリは x86_64 のまま | [survey-small-pass.md](./survey-small-pass.md) |
| 評価版 dylib を koffi で Synthe / FreeWave | AT1 f1 / AT2 / AT10 とも WAV。AT10 は 16kHz 実測。ホスト Node であり Electron 内ではない | [survey-small-pass.md](./survey-small-pass.md) |
| 現行 `electron.remote` の棚卸し | `app` / `getGlobal('appCfg')` / `getCurrentWindow` / `require('console')`。`@electron/remote` は未導入 | [survey-small-pass.md](./survey-small-pass.md) |
| AqKanji2Koe の Convert スニペット | 評価版 dylib で Create / Convert / Release が通る。**works**。辞書は `aq_dic`、`ConvertW` は無い | [survey-aqkanji2koe.md](./survey-aqkanji2koe.md) |
| AT1 を AT2 / AT10 と同じ直呼びにできるか | **できる。** f1 / m1 とも WAV。同じプロセスでも混ざらない。`maquestalk1` は新版で不要 | [survey-at1-direct.md](./survey-at1-direct.md) |

## NOW（残り）

無し。スニペットで足りる調査はここまで。アプリ全体は作らない。`maquestalk1` の書き換えもしない（直呼びできるので、書く対象は CLI ではない）。

## THEN（調査のあと。cc-sdd の仕様 → 実装）

1. `maquestalk1` / `maquestalk1-ios` を捨てて、AT1 を AT2 / AT10 と同じ koffi 直呼びに載せる（CLI は書き直さない）
2. `myukkurivoice-vendor`（評価版 SDK、AT1 の声種 dylib、`secret`、talk2 の追加 3 phont。`maquestalk1` バイナリは入れない）
3. FFI を koffi に置き換え（アプリ側。talk1 も含む）
4. `electron.remote` を `@electron/remote` に置き換え
5. Electron / Node を上げる
6. arm64 パッケージ・署名・公証・MAS
7. テスト（Playwright 化は許可が必要）
8. CI
9. 独立ライブラリを 1 件ずつ

THEN 1 は将来の作業。アクティブな spec ディレクトリは無い。feature 名は taku-o が工程 1 を出すときに決める。`at1-koffi-direct` は再作成しない。詳細は [cc-sdd-adoption.md](./cc-sdd-adoption.md)。

各スペックの順（飛ばさない。各工程のあと taku-o 待ち）:

1. `/kiro-spec-requirements` — Cursor
2. `/kiro-validate-gap` — Cursor
3. `/kiro-spec-design` — Cursor
4. `/kiro-validate-design` — Cursor
5. `/kiro-spec-tasks` — Cursor
6. 人間レビュー（requirements / design / tasks） — Cursor。`/kiro-review-spec` は Claude Code 専用（Cursor では動かない）
7. `/kiro-impl {feature} {task_number}`（1タスクだけ） — Claude Code
8. `/kiro-validate-impl {feature} {task_number}` — Claude Code
9. `/kiro-review-feature` / `/code-review` — Claude Code（Cursor では動かない）

THEN 全体の roadmap は書いていない。`-y` は使わない。`/kiro-spec-init` は使わない。`approved` は自分で立てない。Cursor は製品実装を始めない。実装を頼まれたら引き渡しパック（パス、feature 名、task number、spec ファイル、制約）を作る。

## LATER（今はやらない）

アプリ全体、パッケージング、公証、本物の renderer が要る調査。

| 項目 | 後回しにする理由 |
| --- | --- |
| 公証できる Electron の版を、アプリをパッケージして決める | ほぼ全体のビルドが要る |
| 本番 renderer の中だけで分かる FFI | 本物のアプリ経路が要る |
| 本番の MAS / 署名 | パッケージング後 |
| Playwright へのテスト移行そのもの | テスト変更の許可と成果物パスが要る |

## やらないこと（この段階）

- `maquestalk1` / アプリの書き換え（実装は工程 7。Claude Code。taku-o が `{task_number}` を出すまで入らない。Cursor は始めない）
- Cursor で `/kiro-impl` を走らせる。Cursor で `/kiro-review-spec` / `/kiro-review-feature` が動くと装う
- `/kiro-spec-init` を使う。`at1-koffi-direct` を再作成する
- taku-o の工程 1 より先に `requirements.md` / `design.md` / `tasks.md` / `spec.json` を新規作成する
- `spec.json` の `approved` を自己判断で付ける
- `-y` を付ける。工程をまとめて進める
- SDK バイナリを git / store にコピー
- 「完了」「complete」をユーザー許可なく使う
