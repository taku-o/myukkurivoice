# 作業再開メモ

新しい会話でこの作業を続けるときの入口。詳細な方針は `planning.md`。ユーザー発言の履歴は `prompt.md`。

**今の段階:** 計画の整理まで。実装には入っていない。`requirements.md` / `design.md` / `tasks.md` / `spec.json` はまだ無い。

## 新しい会話の始め方

1. このファイルと `planning.md` を読む
2. ブランチが `feature/applecpu/master` か確認する
3. ユーザーの次の指示を待つ。指示なしに調査実装や要件定義を始めない

再開の指示例:

- 「調査を始めて」→ 評価版 SDK の有無を確認してから、`planning.md` 手順 1 を進める
- 「要件定義を作って」→ そのとき初めて `requirements.md` を作る
- 評価版 SDK の場所を教えてくれた → そのパスで調査する

## 何の作業か

MYukkuriVoice を **Apple Silicon（arm64）専用** にし、必要な範囲で古いライブラリを上げる。Intel / Universal / Rosetta は対象外。AngularJS 1.x は置き換えない。

## 確定している方針

- 最新版アプリは arm64 のみ
- AngularJS 1.x、`nodeIntegration: true` は維持。preload 全面移行はしない
- ドキュメントにない機能は作らない。最適化・フォールバックは入れない
- AquesTalk 現行 vendor に arm64 は無い。開発はアクエストの **評価版 SDK** を使う。評価版の再配布はしない。有償ライセンスは評価版で足りないと分かってから決める
- `vendor/` は自作 submodule `myukkurivoice-vendor`。アクエスト製ライブラリと自作 CLI をまとめる場所
- `maquestalk1` / `maquestalk1-ios` / `secret` は自作。FFI ではなく外部コマンド
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
| `/Users/taku-o/Desktop/maquestalk1` | taku-o/maquestalk1 | AquesTalk1 Mac 用 CLI（Xcode） |
| `/Users/taku-o/Desktop/maquestalk1-ios` | taku-o/maquestalk1-ios | AquesTalk1 iOS 用 CLI（Xcode） |
| `/Users/taku-o/Desktop/myukkurivoice-secret` | myukkurivoice/myukkurivoice-secret | ライセンスキー取得 CLI（Go） |

GitHub 操作は `taku-o`（mail@nanasi.jp）アカウント。`git-switch-account show` で確認してから commit / push。

コミットはユーザーが明示したときだけ。push も明示したときだけ。

## 実装の順番（調査のあと）

1. `myukkurivoice-vendor`（評価版 SDK、`maquestalk1` 系、`secret` の arm64）
2. FFI 置き換え（`ffi-napi` → koffi 想定）
3. `electron.remote` 置き換え（`@electron/remote` が最小）
4. Electron / Node 更新
5. arm64 パッケージング・署名・公証・MAS
6. Spectron → Playwright（テスト変更の許可が必要）
7. CI
8. 独立ライブラリ（1件ずつ）

## 次にやること（止まっている地点）

計画は `planning.md` に書いた。**次は実装ではなく調査。** ただし調査も、ユーザーの開始指示がまだない。

調査項目:

1. AquesTalk 評価版 SDK（Mac, Apple Silicon）のパス・API・辞書・phont・サンプリングレート
2. `maquestalk1` / `maquestalk1-ios` を評価版で arm64 ビルドできるか。`secret` を `go build` で arm64 にできるか（secret は SDK 非依存なので、指示があれば先にできる）
3. koffi 等で評価版の Synthe / FreeWave が呼べるか
4. その FFI が動き、公証できる Electron の版
5. `@electron/remote` で現行の `remote.app` / `getGlobal` / `getCurrentWindow` が足りるか

ブロッカー: 評価版 SDK はアクエスト公式からユーザーが入手する。エージェントは利用規約同意やダウンロードを代行しない。入手場所を教えてもらう。

調査結果が出るまで、スペック分割は確定しない。

## やってはいけないこと

- ユーザーの明示なしに `requirements.md` / `design.md` / `tasks.md` / `spec.json` を新規作成する
- `spec.json` の `approved` を自己判断で `true` にする
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

## このフォルダのファイル

- `planning.md` — 計画
- `prompt.md` — 会話で出た指示のメモ
- `initial-setup.md` — 初期コマンド
- `resume.md` — 再開用（本ファイル）
