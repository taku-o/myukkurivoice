# Apple CPU 対応 — 残作業プラン

taku-o 向け。正本は [taku-o/myukkurivoice](https://github.com/taku-o/myukkurivoice) の `feature/applecpu/master` にある `.kiro/specs/00-planing/resume.md`。詳細方針は同フォルダの `planning.md`。

**番号の見分け（混ぜない）**

| 呼び方 | 中身 |
| --- | --- |
| **THEN 1–9** | 製品の作業順。1 vendor ファイル、2 talk1 CLI→dylib、3 ffi-napi→koffi、4 `@electron/remote`、5 Electron/Node（Node は Electron 同梱）、6 パッケージ、**7 テスト**、8 CI、9 独立ライブラリ |
| **cc-sdd** | コマンド名で呼ぶ。番号を THEN と共有しない |

裸の「工程 7」は使わない。THEN 7 はテスト。実装コマンドは `/kiro-impl`。

**進め方:** 開発の前に調査する。アプリ全体を作らないと確かめられない調査は後回し。短い順は [upcoming-work.md](./upcoming-work.md)。cc-sdd は [cc-sdd-adoption.md](./cc-sdd-adoption.md)。

指示なしに実装・要件定義は始めない。`/kiro-spec-init` は使わない。`at1-koffi-direct` は再作成しない。

**taku-o 決定（2026-09-18）:** 新版の AquesTalk1 は **Mac 評価版を使う。** iOS は Mac AT1 が無かったときの回避策。iOS SDK は取らない・要求しない。Mac AT1 が足りないと証明されたときだけ戻す。

## 今の状態

**実装には入っていない。** 小さい調査は済んだ。アクティブな spec は無い。

- 評価版の実体パス: `/Users/taku-o/Desktop/myukkurivoice-lib`（`~/Desktop/myukkurivoice-lib`）
- 棚卸し: [sdk-inventory.md](./sdk-inventory.md)
- talk1 リンク試験: [survey-maquestalk1.md](./survey-maquestalk1.md)
- AT1 直呼び: [survey-at1-direct.md](./survey-at1-direct.md)（できる。CLI は捨てる）
- talk2 古い phont: [survey-talk2-phonts.md](./survey-talk2-phonts.md)
- 小さい調査: [survey-small-pass.md](./survey-small-pass.md)
- AqKanji2Koe Convert: [survey-aqkanji2koe.md](./survey-aqkanji2koe.md)（**works**）
- `requirements.md` / `design.md` / `tasks.md` / `spec.json` はまだ無い
- 本体ブランチ `feature/applecpu/master` は origin にあり、計画ドキュメントの先端は `ba8280d`。再開時は `git log -1`
- `maquestalk1` は書き直さない。捨てる（THEN 2）。まだ捨てていない

## 次にやること

短い順: [upcoming-work.md](./upcoming-work.md)。小さい調査の結果: [survey-small-pass.md](./survey-small-pass.md)。

**NOW（小さい調査。スニペット / CLI 1本）** — **残り無し。** 結果は [survey-small-pass.md](./survey-small-pass.md)

1. `myukkurivoice-secret` の arm64 `go build` → 実施。`/tmp` の arm64 が動く
2. 評価版 dylib を koffi で Synthe / FreeWave → 実施。AT1 f1 / AT2 / AT10。AT10 は 16kHz 実測。ホスト Node（Electron 内ではない）
3. 現行 `electron.remote` の棚卸し → 実施。上げていない

**THEN（調査のあと。実装）**

**見分け:** THEN 1=ファイル投入。THEN 2 と THEN 3=アプリコード。THEN 3≠ライブラリ更新（それは THEN 9）。アプリは `vendor/` を読むので、vendor が先。

- **THEN 1. ファイル。** `myukkurivoice-vendor`（評価版 SDK、AT1 の声種 dylib、`secret` の arm64、talk2 の追加 3 phont。`maquestalk1` / `maquestalk1-ios` のバイナリは入れない）
- **THEN 2. talk1 の呼び方（アプリコード）。** `maquestalk1` / `maquestalk1-ios` の外部コマンドを捨てる。vendor の AT1 dylib をプロセス内で直呼びする。CLI は書き直さない
- **THEN 3. FFI の道具（アプリコード）。** AT2 / AT10 / AqKanji2Koe の `ffi-napi` を `koffi` に替える。vendor の差し替えではない。ライブラリ更新でもない。talk1 は THEN 2 で既に koffi なら、ここでは触らない
- **THEN 4.** `electron.remote` を `@electron/remote` に置き換え
- **THEN 5.** Electron / Node を上げる（Node は Electron 同梱。Electron 6 のままにしない）
- **THEN 6.** arm64 パッケージ・署名・公証・MAS
- **THEN 7.** テスト（Playwright は許可が必要。移行そのものは LATER）
- **THEN 8.** CI
- **THEN 9.** 独立ライブラリ 1 件ずつ（ここがライブラリ更新）

**LATER（今はやらない）**

公証できる Electron をアプリごとパッケージして決める。本番 renderer の中だけで分かる FFI。本番 MAS / 署名。Playwright 移行そのもの。

| ユーザーが言うこと | エージェントがすること |
| --- | --- |
| 「小さい調査を続けて」 | NOW は済んでいる |
| 「maquestalk1 を直して」 | しない。CLI は捨てる。捨てるのは THEN 2（vendor のあと） |
| 「要件定義を作って」 | そのとき初めて `requirements.md` を作る。入口は `/kiro-spec-requirements` |

## ブロッカー

評価版 Mac 4 本の場所は分かった。調査 1 のパス待ちは解消。

残っているもの:

- 調査 2 の Mac AT1 リンク試験は実施済み。[survey-maquestalk1.md](./survey-maquestalk1.md)。判定は **要作業**（SDK は足りる。現行 CLI / アプリ経路はそのままでは使えない）。iOS SDK は今は不要。CLI は直さず捨てる（THEN 2）
- 調査 3 の最小 koffi 呼び出しと `electron.remote` 棚卸しは実施済み。[survey-small-pass.md](./survey-small-pass.md)。公証できる Electron の版決めは LATER
- talk2 の `aq_defo1` / `aq_momo1` / `aq_teto1` は公式評価版に無い（アプリが後から足した）。コピーして Synthe すると 3つとも works。[survey-talk2-phonts.md](./survey-talk2-phonts.md)。配布に残すかは未決
- AquesTalk10 の 16kHz は koffi スニペットで実測した（`fsc=100` で 16000Hz）。アプリ再生経路はまだ

`secret` の arm64 `go build` は実施済み（`/tmp` のみ。checkout の既存バイナリは x86_64 のまま）。

## SDK入手

**エージェントは評価版 SDK をダウンロードできない。** ユーザーが入手してパスを教える。

入口: [https://www.a-quest.com/download.html](https://www.a-quest.com/download.html)（2026-09-17 確認。アカウント不要。Download は Cloudflare Turnstile 後に `POST /protected_download.php`。直リンク GET は 403）

Apple Silicon 作業で必要な Mac 評価版（公式表の版。2025-04 に arm64 対応）:

| 製品 | Version | HTML 上のファイル（直 GET 不可） | マニュアル（公開 PDF） |
| --- | --- | --- | --- |
| AquesTalk10 Mac | 1.1.1 (2025/04/28) | `https://www.a-quest.com/archive/protected-files/aqtk10_mac_111.dmg` | [aqtk10_mac_man.pdf](https://www.a-quest.com/archive/manual/aqtk10_mac_man.pdf) |
| AquesTalk2 Mac | 2.4.1 (2025/04/27) | `https://www.a-quest.com/archive/protected-files/aqtk2_mac_eva_0241.dmg` | [aqtk2_mac_man.pdf](https://www.a-quest.com/archive/manual/aqtk2_mac_man.pdf) |
| AquesTalk1 Mac | 2.0.1 (2025/04/23) | `https://www.a-quest.com/archive/protected-files/aqtk1_mac_0201.dmg` | [aqtk1_mac_man.pdf](https://www.a-quest.com/archive/manual/aqtk1_mac_man.pdf) |
| AqKanji2Koe-A Mac | 4.1.1 (2025/04/26) | `https://www.a-quest.com/archive/protected-files/aqk2k_mac_411.dmg` | [aqk2k_mac_man.pdf](https://www.a-quest.com/archive/manual/aqk2k_mac_man.pdf) |

製品ページ: [AquesTalk10](https://www.a-quest.com/products/aquestalk10.html) / [AquesTalk2](https://www.a-quest.com/products/aquestalk_2.html) / [AquesTalk1](https://www.a-quest.com/products/aquestalk_1.html) / [AqKanji2Koe](https://www.a-quest.com/products/aqkanji2koe.html)。AqUsrDic は AqKanji2Koe-A のパッケージ内。**AquesTalk1 iOS は取らない。** Mac AT1 が足りないと証明されたときだけ戻す。

ユーザー側: ブラウザで上のページを開き、ページ記載（評価目的のみ・再配布禁止）を守ったうえで Turnstile を通して 4 つの Mac Download を取る。アカウント・メール・別 TOS フォームは評価版入手には無い。製品版 SDK は開発ライセンス（個人は [ライセンス](https://www.a-quest.com/licence.html) / [個人利用](https://www.a-quest.com/licence_free.html)）。

エージェントが取らない理由: (1) 直ファイル URL は 403、取得は Turnstile + POST が必要 (2) 公式が評価目的のみ・再配布禁止、計画も代行しない。マニュアル PDF は公開 GET 可だが SDK 本体ではない。

入手済みの評価版（2026-09-18 実測。詳細は [sdk-inventory.md](./sdk-inventory.md)）:

- パス: `/Users/taku-o/Desktop/myukkurivoice-lib`
- DMG: `AquesTalk評価版dmg/` に公式 4 ファイル（`aqtk1_mac_0201.dmg` / `aqtk2_mac_eva_0241.dmg` / `aqtk10_mac_111.dmg` / `aqk2k_mac_411.dmg`）
- 展開: `AquesTalk1/` `AquesTalk2/` `AquesTalk10/` `AqKanji2Koe/`。全部 **dylib**。`.framework` は無い
- Mac 4 本の欠けは無い。**AquesTalk1 iOS はこのフォルダに無い**（方針: 今は入手しない）
- arch: AquesTalk1 と AqKanji2Koe/AqUsrDic は **arm64 のみ**。AquesTalk2 Eva と AquesTalk10 は **x86_64 + arm64**
- サンプリング: AquesTalk1/2 は 8kHz。AquesTalk10 は 16kHz（`fsc` で変化）。koffi スニペットで実測済み。[survey-small-pass.md](./survey-small-pass.md)。アプリ再生経路はまだ
- 辞書: 評価版は `aq_dic/`（`aqdic.bin` 9.4M）。現行 `vendor/aq_dic_large`（12M）とは別物
- talk2 phont: 公式評価版 14 種。現行の `aq_defo1` / `aq_momo1` / `aq_teto1` は後から足したもの。新評価版へコピーすると Synthe できる（3つとも works）。[survey-talk2-phonts.md](./survey-talk2-phonts.md)

アプリが読む現行 `vendor/`（まだ framework）:

- `AquesTalk.framework` / `AquesTalk2.framework` / `AquesTalk10.framework` / `AqKanji2Koe.framework` / `AqUsrDic.framework` / `phont` / `aq_dic_large`
- vendor リポジトリ内の現行 SDK 展開先: `aqtk1-mac/` / `aqtk2-mac/` / `aqtk10-mac/` / `aqk2k_mac/` / `aqtk1-ios/`
- 作業ディレクトリ: `/Users/taku-o/Desktop/myukkurivoice-vendor`（本体は `/Users/taku-o/Desktop/myukkurivoice`）

## 調査項目（NOW / LATER）

1. AquesTalk 評価版 SDK（Mac, Apple Silicon）のパス・API・辞書・phont・サンプリングレート → 棚卸しは [sdk-inventory.md](./sdk-inventory.md)。WAV ヘッダ実測は koffi スニペットで実施。[survey-small-pass.md](./survey-small-pass.md)
2. `maquestalk1` の Mac AT1 リンク試験は実施済み。**製品ビルドはしない。書き直さない。** CLI は THEN 2 で捨てる（THEN 1 の vendor のあと）。`secret` の arm64 `go build` は実施済み。**iOS は対象外**
3. koffi 等で評価版 dylib の Synthe / FreeWave が呼べるか → 実施済み（`/tmp` 最小）。本番 renderer は LATER
4. その FFI が動き、公証できる Electron の版 → **LATER**（アプリをパッケージする調査）
5. 現行 `electron.remote` の棚卸し → 実施済み。`@electron/remote` への上げは THEN 4

調査で設計が成立しない場合は、実装を変えずに報告する。調査結果が出るまでスペック分割は確定しない。

## 調査後の作業順（THEN）

正本: [upcoming-work.md](./upcoming-work.md)

**見分け:** THEN 1=ファイル投入。THEN 2 と THEN 3=アプリコード。THEN 3≠ライブラリ更新（それは THEN 9）。アプリは `vendor/` を読むので、vendor 更新が先。

- **THEN 1. ファイル。** `myukkurivoice-vendor`（評価版 SDK、AT1 の声種 dylib、`secret` の arm64、talk2 の追加 3 phont。`maquestalk1` / `maquestalk1-ios` のバイナリは入れない）
- **THEN 2. talk1 の呼び方（アプリコード）。** `maquestalk1` / `maquestalk1-ios` の外部コマンドを捨てる。vendor の AT1 dylib をプロセス内で直呼びする。CLI は書き直さない
- **THEN 3. FFI の道具（アプリコード）。** AT2 / AT10 / AqKanji2Koe の `ffi-napi` を `koffi` に替える。vendor の差し替えではない。ライブラリ更新でもない。talk1 は THEN 2 で既に koffi なら、ここでは触らない
- **THEN 4.** `electron.remote` を `@electron/remote` に置き換え
- **THEN 5.** Electron / Node 更新（Node は Electron 同梱。Electron 6 のままにしない）
- **THEN 6.** arm64 パッケージング・署名・公証・MAS
- **THEN 7.** テスト（Playwright 化は許可が必要。移行そのものは LATER）
- **THEN 8.** CI
- **THEN 9.** 独立ライブラリ（1件ずつ。一括しない。ライブラリ更新はここ。THEN 3 ではない）

## 未決・確認事項

- 評価版 SDK のローカルパス → `/Users/taku-o/Desktop/myukkurivoice-lib`（調査 1 で確認）
- 評価版の形式 → **dylib**（`.framework` ではない）。アプリ側パス追従は後段。実装はしていない
- 新 AquesTalk10 のサンプリングレート → koffi スニペットで 16000Hz（`fsc=100`）。アプリ再生はまだ 8000Hz 前提。THEN でパス追従
- **AquesTalk1 は Mac 評価版が正本。** iOS は最後の手段のみ。リンク試験: [survey-maquestalk1.md](./survey-maquestalk1.md)。判定は要作業（SDK は足りる。現行 `maquestalk1` は `SyntheMV` + framework + i386 のまま）。直さず捨てる
- AqKanji2Koe-A の辞書は `aq_dic/aqdic.bin`（9.4M）。現行 `aq_dic_large`（12M）と不一致
- talk2 の `aq_defo1` / `aq_momo1` / `aq_teto1` は新評価版でも Synthe できる。公式パッケージには無い。配布に残すかは未決。調査: [survey-talk2-phonts.md](./survey-talk2-phonts.md)
- AquesTalk1 新 SDK は `SyntheMV` が無く、声種は dylib 差し替え。現行 CLI はそのままリンクできない。書き直さない
- 到達 Electron の版（計画では固定しない。公証でき、選んだ FFI が動くこと。Electron 6 のままにしない。Node は Electron 同梱）
- 製品配布用の有償ライセンスが必要か（評価版で開発が成立してから決める）。AquesTalk2 評価版は `*Eva*` 専用で SetDevKey が無い
- `intro.js` 8 のチュートリアル UI が既存手順と一致するか
- mocha / chai / eslint のメジャーアップでテストコード変更が必要になった場合の許可

## やってはいけないこと（再開時）

- `/kiro-spec-init` を使う。`at1-koffi-direct` を再作成する
- 指示なしに `requirements.md` / `design.md` / `tasks.md` / `spec.json` を作る
- Angular 置き換え、preload 全面移行、Universal / Rosetta 回避
- 評価版 SDK を配布物に入れる
- 一括 sed / 一括ライブラリ更新
- テストコードの無許可変更
- 干渉したライブラリを黙って戻す
- `maquestalk1` を新 API 向けに書き直す（捨てる）
- 「完了」「complete」をユーザー許可なく使う
