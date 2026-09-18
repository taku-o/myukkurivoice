# MYukkuriVoice Apple Silicon 対応とライブラリ更新 計画

作業を中断したあとの再開は `.kiro/specs/00-planing/resume.md` から。詳細方針の正本はこのファイル。

## いまここ（2026-09-18）

実装には入っていない。`requirements.md` / `design.md` / `tasks.md` / `spec.json` は、指示があるまで作らない。

**進め方（taku-o）:** 開発の前に調査する。アプリ全体を作らないと確かめられない調査は後回し。短い一覧は Project store の `docs/upcoming-work.md`。

**決まったこと**

- 評価版 SDK: `~/Desktop/myukkurivoice-lib`（実体 `/Users/taku-o/Desktop/myukkurivoice-lib`）。git に入れない
- Mac 評価版は **dylib**。`.framework` は無い
- AquesTalk1 は **Mac 評価版を使う**。iOS は、Mac AT1 が足りないと証明されたときだけの最後の手段。iOS SDK は今は取らない
- `maquestalk1` は現行のままでは呼べない。新 API が要る: `AquesTalk_Synthe_Utf8` + 声種ごとの dylib。`SyntheMV` は無い
- `maquestalk1-ios` は今は使わない

**調査の状態**

| 項目 | 状態 |
| --- | --- |
| 調査 1 SDK 棚卸し | 実施済み。Mac 4 本は dylib / arm64。iOS は drop に無い |
| 調査 2 talk1 リンク試験 | 実施済み。判定は要作業（SDK は足りる。現行 CLI はそのままでは不可） |
| talk2 古い 3 phont（`aq_defo1` / `aq_momo1` / `aq_teto1`） | 実施済み。公式評価版には無い（アプリが後から足した）。新評価版へコピーして Synthe すると **3つとも works** |
| NOW: `secret` arm64 `go build` / koffi 最小 Synthe・FreeWave / `electron.remote` 棚卸し | 小さい調査。これから |
| LATER: 公証できる Electron の版決め、本番 renderer の FFI、本番 MAS、Playwright 移行そのもの | 後回し（アプリ全体が要る） |

**これからやること（順序）**

NOW（スニペット / CLI 1本）:

1. `myukkurivoice-secret` の arm64 `go build`（SDK 非依存）
2. 評価版 dylib を koffi（または同等）で Synthe / FreeWave（`/tmp` のみ。AT2 と/または AT10、AT1 f1）
3. 現行 `electron.remote` の棚卸し（上げない。`@electron/remote` への置換は THEN）

THEN（調査のあと。実装）:

1. `maquestalk1` を Mac AT1 新 API 向けに直す
2. `myukkurivoice-vendor`（評価版 SDK、自作 CLI、talk2 の追加 3 phont）
3. FFI を koffi に置き換え
4. `electron.remote` を `@electron/remote` に置き換え
5. Electron / Node を上げる
6. arm64 パッケージ・署名・公証・MAS
7. テスト（Playwright 化は許可が必要）
8. CI
9. 独立ライブラリを 1 件ずつ

LATER（今はやらない）: アプリをパッケージして公証できる Electron を決めること。本番 renderer の中だけで分かる FFI。本番の MAS / 署名。Playwright へのテスト移行そのもの。

## 1. 目的

現行アプリは **Intel CPU（x64）向け** にビルドされている。このままでは、近い将来ユーザー環境で動かなくなる。あわせて、利用ライブラリの多くが古い。本計画は、その対応で発生する作業と、開発の進め方を整理する。

最新版アプリは **arm64 のみ** とする。Intel Mac 向けの継続対応はしない。

本計画の対象は次の2点に限る。

- Apple Silicon（arm64）のみでネイティブ動作する配布物を作ること
- そのために必要な範囲で、古いライブラリを新しいバージョンへ更新すること

## 2. 前提（この計画で変えないこと / 決めたこと）

- **最新版アプリの CPU 対応は arm64 のみ。** Intel（x64）向けビルドは出さない。Universal Binary にもしない。Rosetta 前提の動作も対象にしない。
- **AngularJS 1.x は置き換えない。** 開発は止まっているが、置き換えは変更が大きすぎる。
- ドキュメントにない機能は作らない。将来の拡張も考慮しない。
- 最適化、フォールバック機能は入れない。
- 既存の音声生成・録音・設定・辞書・動画連携の機能範囲は維持する。機能追加ではない。
- **AquesTalk は Apple Silicon 対応版へ更新する。** 現行 vendor に arm64 は含まれない。vendor 自体は自作リポジトリ（`myukkurivoice-vendor`）。開発ではアクエスト公開の評価版 SDK を使う（従来どおり）。置き場は `~/Desktop/myukkurivoice-lib`。形式は **dylib**（`.framework` ではない）。**AquesTalk1 は Mac 評価版。** iOS は最後の手段。製品配布用の有償ライセンスは、評価版では足りないと分かった時点で決める。評価版の再配布はしない。
- **独立ライブラリは上げる。** 同じメジャー / パッチは上げる。メジャーが飛ぶもの（`intro.js` を含む）は可能なら上げる。干渉して動かない場合は報告し、その時点で対応を決める。一括更新はしない。
- **UI 変更の許容範囲。** バージョンアップに伴う多少の UI 変化は許容する。大幅な UI 変更はしない。`intro.js` だけは例外で、チュートリアル UI の変更も試みる。新しいチュートリアル機能は足さない。
- **Git ブランチ。** 自前プロジェクトの機能変更は、`develop` があればそこから、なければ `master` から作業ブランチを切る。ブランチ名は本体 `myukkurivoice` の作業ブランチに合わせる。今回は `feature/applecpu/master`。`develop` / `master` 上では直接作業しない。

## 3. 現状

| 項目 | 現状 |
| --- | --- |
| ランタイム | Electron 6.1.7 / Node.js v12.4.0 / Chrome 76 |
| 配布アーキテクチャ | `electron-packager --arch=x64`。成果物は `MYukkuriVoice-darwin-x64` / `MYukkuriVoice-mas-x64` |
| UI | AngularJS 1.7.8。Renderer は `nodeIntegration: true` と `enableRemoteModule: true` |
| Native 連携 | `ffi-napi` + `ref-napi` + `ref-struct-di` で AquesTalk の framework を呼び出す |
| AquesTalk | submodule `vendor`（https://github.com/myukkurivoice/myukkurivoice-vendor）。自作の配布リポジトリ。中身はアクエスト製 `.framework` と自作 CLI。実測で **arm64 なし** |
| ビルド | Gulp 4。TypeScript 3.5.3 |
| テスト | Mocha + Chai + Spectron。パスが `MYukkuriVoice-darwin-x64` 固定 |
| CI | GitHub Actions。Node 12.4.0、`actions/checkout@v1` など古い Action。成果物も x64 |

Renderer は `require('electron').remote` と `require('ffi-napi')` を直接使っている。AngularJS を維持する以上、Renderer から Node API を使う構造は残す。preload への全面移行は AngularJS 置き換えに近い規模になるため、本計画の対象外とする。

## 4. なぜ今対応するか

2026-09-14 に macOS 27 Golden Gate が公開された。

- **Intel Mac 向けの最後のメジャー OS は macOS 26 Tahoe。** Golden Gate は Apple Silicon 専用。
- **Golden Gate は、Apple Silicon 上で Intel アプリを動かす Rosetta 2 の最後のフルサポート版。** 次期メジャー（macOS 28、2027年想定）では、Intel 専用アプリは Apple Silicon 上でも動かなくなる。
- 現行配布物は x64 専用なので、Rosetta なしでは起動できない。
- Electron 6 / Node 12 はサポート終了済み。現行 macOS の公証・CI ランナー（`macos-latest` は Apple Silicon）とも噛み合わなくなっている。

Apple Silicon ネイティブ化は新機能ではなく、現行アプリが動き続けるための対応である。

## 5. 作業が発生する領域

作業は独立していない。後段は前段の結論に依存する。

```
AquesTalk 評価版 SDK（Apple Silicon）─┐
FFI 置き換え方針                     ──┼─→ Electron / Node 到達バージョン確定
electron.remote 方針                 ──┘              │
                                       ▼
                         開発環境・CI の Node 更新
                                       │
                                       ▼
              FFI 置き換え → remote 置き換え → Electron 更新
                                       │
                                       ▼
              myukkurivoice-vendor を更新 → arm64 パッケージング
                                       │
                                       ▼
              テスト基盤の置き換え → 署名・公証・MAS → 周辺ライブラリ更新
```

評価版は開発・確認用。配布物に評価版を入れない。

### 5.1 AquesTalk vendor（Apple Silicon 対応版へ更新）

`vendor/` は第三者の黒箱ではない。自作のプライベートリポジトリを submodule している。

- リポジトリ: https://github.com/myukkurivoice/myukkurivoice-vendor
- 参照: `.gitmodules` の `git@github.com:myukkurivoice/myukkurivoice-vendor.git`
- 役割: アクエスト製ライブラリと、自作 CLI（`maquestalk1` / `maquestalk1-ios` / `secret`）をまとめてアプリへ渡す

Apple Silicon 対応は、まずこの vendor リポジトリを更新する作業である。アプリ本体は submodule を追従し、パスが変わったときだけコードを直す。

現行 vendor を `lipo -info` で確認した。

アクエスト製:

| バイナリ | アーキテクチャ | arm64 |
| --- | --- | --- |
| `AquesTalk.framework`（AquesTalk1 Mac） | i386, ppc | なし |
| `AquesTalk2.framework` | x86_64 | なし |
| `AquesTalk10.framework` | x86_64 | なし |
| `AqKanji2Koe.framework` | x86_64 | なし |
| `AqUsrDic.framework` | x86_64 | なし |

自作（外部コマンド。FFI ではない）:

| バイナリ | リポジトリ | 役割 | アーキテクチャ | arm64 |
| --- | --- | --- | --- | --- |
| `maquestalk1` | https://github.com/taku-o/maquestalk1 | AquesTalk1 Mac を呼ぶ CLI | i386 | なし |
| `maquestalk1-ios` | https://github.com/taku-o/maquestalk1-ios | AquesTalk1 iOS を呼ぶ CLI | x86_64 | なし |
| `secret` | https://github.com/myukkurivoice/myukkurivoice-secret | 開発ライセンスキー取得（Go） | x86_64 | なし |

arm64 の Electron プロセスは、x86_64 / i386 の dylib を `dlopen` できない。アプリを arm64 のみにするなら **AquesTalk 側の更新は必要** である。

AquesTalk2 / 10 / 辞書は FFI で framework を直接呼ぶ。AquesTalk1 は `maquestalk1` / `maquestalk1-ios` を、ライセンスキーは `secret` を、それぞれ外部コマンドとして実行する。Catalina 以降は i386 の Mac 版 AquesTalk1 が動かないため、**現行アプリ**は iOS 版 bridge に切り替えている。新版では Mac AT1 評価版を正本にする。iOS は最後の手段。

開発では、従来どおりアクエストの **評価版 SDK** を使う。入手済みの置き場は `~/Desktop/myukkurivoice-lib`。

| 製品 | 評価版（調査時点） | この drop |
| --- | --- | --- |
| AquesTalk10 Mac | 1.1.1（2025-04-28）Apple Silicon 対応 | dylib、arm64 + x86_64 |
| AquesTalk2 Mac | 2.4.1（2025-04-27）Apple Silicon 対応 | dylib（`libAquesTalk2Eva.dylib`）、arm64 + x86_64 |
| AquesTalk1 Mac | 2.0.1（2025-04-23）Apple Silicon 対応 | 声種ごとの dylib、arm64 のみ |
| AqKanji2Koe-A Mac | 4.1.1（2025-04-26）Apple Silicon 対応 | dylib、arm64 のみ |

評価版の制限は「ナ行・マ行がヌになる」。開発ライセンスキーを入れない状態。評価版パッケージの再配布は禁止。配布アプリには入れない。形式は全部 **dylib**。`.framework` は評価版側に無い。**AquesTalk1 iOS は取らない**（Mac AT1 が足りないと証明されたときだけ戻す）。

発生作業（リポジトリの順）:

1. 評価版 SDK の入手、dylib のパス、関数シグネチャ、辞書・phont の差分確認（棚卸し済み。WAV 実測は未実施）
2. `maquestalk1` を Mac AT1 評価版で arm64 ビルドし直す。API は `AquesTalk_Synthe_Utf8` + `FreeWave`。声種は dylib 差し替え（`f1` / `m1`）。`SyntheMV` は無い。`maquestalk1-ios` は今は対象外
3. `secret` を arm64 向けに `go build` する（https://github.com/myukkurivoice/myukkurivoice-secret）
4. 上記を `myukkurivoice-vendor` に入れ、submodule を更新する
5. アプリ側のパス追従。現行は `.framework`、評価版は dylib。`gulpfile.package.js` の unpacked コピー、asar ignore、`DynamicLibrary` パス
6. AquesTalk1 は Mac 評価版が正本。本体の Catalina / iOS 切替は、Apple Silicon では Mac CLI 固定にする。iOS は最後の手段
7. サンプリングレート等の仕様差分。現行は 8000Hz 扱い。新 AquesTalk10 マニュアルは 16kHz。実装前に実測する
8. talk2 の `aq_defo1` / `aq_momo1` / `aq_teto1` は公式評価版に無い（アプリが後から足した）。新評価版へコピーすると Synthe できる。配布に残すかは後で決める
9. 評価版で開発が成立したあと、製品配布に有償ライセンスが必要かは、その時点で決める

評価版 SDK の API 非互換が大きい場合は、ここで止めて報告する。実装を勝手に変えない。

### 5.2 FFI（`ffi-napi` の打ち切り）

`ffi-napi` は Electron 21 以降の V8 Memory Cage と両立しない。実運用上の上限は Electron 20.3.8 付近。現行 Electron 6 のまま arm64 ネイティブ配布はできない（Electron の arm64 公式ビルドは 11 以降）。

macOS 27 / 28 で動き続けるには、現行 Electron に留まれない。したがって **FFI ライブラリの置き換えは必須** である。

発生作業:

- 置き換え先の確定。有力候補は koffi（現行 Electron でも利用実績がある）
- `js/service.aques.ts`（AqKanji2Koe / AquesTalk2 / AquesTalk10）と `js/service.aqusrdic.ts` の呼び出し書き換え
- `ref-napi` / `ref-struct-di` で扱っているポインタ・構造体・`AQTK_VOICE` 相当の定義の移行
- 生成 WAV バッファの所有権（`AquesTalk_FreeWave`）が新しい FFI でも壊れないことの確認
- `package.json` にピン留めしている ffi-napi 一式と、gulp minify / packager ignore の更新

置き換え先は「使えるライブラリがあるならそれを使う」。自前の native addon は、koffi 等で足りない場合に限る。

### 5.3 Electron 更新

x64 固定を外すには Electron 自体の更新が必要。あわせて Node も Electron 同梱版に合わせる。

発生作業（Renderer の AngularJS は残す）:

- `electron.remote` の廃止対応。Electron 14 で remote は本体から外れた。変更を最小にするなら `@electron/remote`。対象は `js/reducers.*.ts`、`js/service.*.ts`、`js/apps.*.ts`、`js/ctrl.helpsearch.ts` など
- `enableRemoteModule` 削除。`webPreferences` の更新
- 破壊的変更の吸収。例: `webContents` の `crashed`、ウィンドウイベント、`app` / `dialog` / `shell` の API
- `nodeIntegration: true` は維持する。contextIsolation 有効化と preload 全面移行は対象外
- 開発用 `devtron` は現行 Electron では使えない。削除または停止

到達バージョンは「現行 macOS で公証でき、選んだ FFI が動くこと」を条件に調査で決める。この計画では版数を固定しない。

### 5.4 パッケージング・署名・配布

発生作業:

- `electron-packager` → `@electron/packager`（または現行の後継）
- `--arch=x64` を `--arch=arm64` へ変更する。x64 と arm64 の両方は作らない
- 成果物パスを `MYukkuriVoice-darwin-x64` 系から `MYukkuriVoice-darwin-arm64` 系へ移す。gulp（package / sign / release / doc / test）、ドキュメント、`package.json` の notarize スクリプトがこのパスに依存している
- MAS 成果物も `MYukkuriVoice-mas-arm64` にする
- `electron-rebuild` → `@electron/rebuild`
- `electron-notarize` → `@electron/notarize`。公証ツールが `altool` から `notarytool` へ既に移行済みであることへの追従
- GitHub 版 zip と MAS 版 pkg の両方
- 配布物の説明（README / リリーステーブル）を、最新版は Apple Silicon（arm64）専用であると分かるように更新する。新規機能の説明は書かない
- ベンダー SDK が Universal Binary でも、Electron アプリのパッケージングは arm64 のみ。x64 スライスを残すための Universal アプリ化はしない

### 5.5 テスト基盤

Spectron は開発終了。対応 Electron は 13 系まで。Electron を上げるなら **Spectron は使えない**。

発生作業:

- 画面がある機能のテストを Playwright へ移す（プロジェクトの受け入れルール）
- テストが参照するアプリパスを `MYukkuriVoice-darwin-x64/...` から `MYukkuriVoice-darwin-arm64/...` へ更新する
- Mocha 本体は残せる。ランチャーとドライバーだけ置き換える想定
- **テストコードの変更は、内容を示したうえでユーザー許可を得てから行う**

### 5.6 開発環境と CI

発生作業:

- 開発 Node を Electron 同梱 Node に合わせる。`docs/development.md` の nvm 手順（v12.4.0）も更新
- GitHub Actions の Node 12.4.0 を更新。`actions/checkout@v1` / `setup-node@v1` / `cache@v1` は現行ランナーで維持できない
- `macos-latest` は Apple Silicon。arm64 のみをそのランナーでビルドする。x64 用ジョブは作らない
- Xcode 前提の更新（現行ドキュメントは Xcode 9.2 / 10.1 表記）

### 5.7 ライブラリ更新の切り分け

「いくつか更新する」が対象。全部を最新にはしない。AngularJS は更新しない（1.7 系のまま利用）。

#### 更新しない

- `angular` / `@types/angular`
- `photon`（CSS フレームワーク自体は更新しない）
- 自前・フォークで、Electron 更新後もビルドできるもの（`electron-path`、`myukkurivoice-about-window` 等）。壊れたものだけ直す

#### Electron / Apple Silicon 到達のために更新する

これらは任意ではない。

| ライブラリ | 理由 |
| --- | --- |
| `electron` | x64 専用かつ古すぎる |
| `ffi-napi` / `ref-napi` / `ref-struct-di` と関連 native | Electron 21 以降で不可。arm64 でも再ビルドが必要 |
| `electron-packager` / `electron-rebuild` / `electron-notarize` / `asar` | パッケージ名が `@electron/*` に移行 |
| `@types/node` | Node 12 向けの型 |
| `spectron` | 後継なし。Playwright へ |
| `typescript` | 新しい `@types/node` / Electron 型を扱うため。必要最小の上げ幅 |

#### Electron 更新に巻き込まれやすいもの

本体 API や Node 版に依存する。Electron を上げる作業の中で、動かなくなったものだけ上げる。

- `electron-store`（2.x）
- `electron-json-storage`（2.x）
- `electron-log`（1.x）
- `electron-localshortcut`（1.x）
- `electron-json-storage` が新しい Electron で死ぬ場合の代替は、既存の `electron-store` へ寄せる。新規の永続化機能は作らない

#### 独立して上げるライブラリ（確定）

一括では上げない。1ライブラリ（または密結合の1組）ずつ上げる。sed や一括スクリプトは使わない。

**同じメジャー / パッチ程度（上げる）**

| パッケージ | 現行 | 上げ先（調査時点の最新） |
| --- | --- | --- |
| `angular-ui-grid` | 4.7.1 | 4.12.7 |
| `uniqid` | 5.1.0 | 5.4.0 |
| `fcpx-audio-role-encoder` | 0.1.2 | 0.1.4 |
| `temp` | 0.8.3 | 0.9.4 |
| `gulp-clean-css` | 4.2.0 | 4.3.0 |
| `gulp-file-include` | 2.0.1 | 2.3.0 |
| `gulp-git` | 2.9.0 | 2.11.0 |
| `gulp-replace` | 1.0.0 | 1.1.4 |
| `keychain` | 1.3.0 | 1.5.0 |
| `source-map-support` | 0.5.16 | 0.5.21 |

**メジャーが飛ぶもの（可能なら上げる）**

上げる。上げた結果、他ライブラリや既存機能と干渉して動かない場合は、黙って戻さず、報告して対応を決める。

| パッケージ | 現行 | 上げ先（調査時点の最新） |
| --- | --- | --- |
| `csv-parse` | 3.2.0 | 7.0.2 |
| `csv-stringify` | 4.3.1 | 6.8.3 |
| `intro.js` | 2.9.3 | 8.5.0 |
| `@types/intro.js` | 2.4.4 | 5.1.5 |
| `lru-cache` | 5.1.1 | 11.5.2 |
| `fs-extra` | 7.0.1 | 11.4.0 |
| `del` | 5.1.0 | 8.0.1 |
| `gulp` / `gulp-cli` | 4.0.2 / 2.2.0 | 5.0.1 / 3.1.0 |
| `gulp-less` | 4.0.1 | 5.0.0 |
| `gulp-markdown` | 3.0.0 | 8.0.0 |
| `gulp-markdown-pdf` | 6.0.0 | 9.0.0 |
| `gulp-rename` | 1.4.0 | 2.1.0 |
| `gulp-sourcemaps` | 2.6.5 | 3.0.0 |
| `gulp-terser` | 1.2.0 | 2.1.0 |
| `gulp-prettier` | 2.3.0 | 7.0.0 |
| `gulp-mocha` | 6.0.0 | 10.0.1 |
| `mocha` | 4.1.0 | 12.0.1 |
| `@types/mocha` | 5.2.6 | 10.0.10 |
| `chai` | 4.2.0 | 6.2.2 |
| `@types/chai` | 4.1.7 | 5.2.3 |
| `eslint` | 5.16.0 | 10.10.0 |
| `@typescript-eslint/parser` | 1.13.0 | 8.70.0 |
| `gulp-eslint` | 5.0.0 | 6.0.0（6 が最終。動かなければ後継パッケージの要否を報告） |
| `gulp-typescript` | 5.0.1 | 安定版がある範囲。6.0.0-alpha.1 は「可能」に含めない |
| `node-notifier` | 5.4.0 | 10.0.1 |
| `yargs` | 12.0.5 | 18.1.0 |
| `@types/rimraf` | 2.0.2 | 4.0.5 |

`intro.js` は 8.x へ上げ、既存チュートリアルを新しい intro.js の UI に合わせて直す。新しいステップや新しいチュートリアル機能は足さない。合わせきれない場合は報告する。

他ライブラリは、バージョンアップに伴う多少の UI 変化は許容する。レイアウトや画面構成を大きく作り直すことはしない。

**更新余地なし（最新と同じ、または実質停止。上げない）**

`angular-input-highlight`、`cryptico.js`、`custom-error`、`github-version-compare`、`on-idle`、`wait-until`、`wav-audio-length`、`wav-encoder`、`wav-fmt-validator`、`gulp-install`、`gulp-jsonminify`、`gulp-markdown-toc`、`gulp-using`、`gulp-wrapper`

mocha / chai / eslint の更新でテストコードの修正が必要になった場合は、修正内容を示したうえで許可を得てから行う。

### 5.8 自前プロジェクト（taku-o / myukkurivoice）

判定: `package.json`、`.gitmodules`、`docs/development.md` の related links。所有者は `taku-o` または `myukkurivoice`。`photon`（connors）は対象外。

#### アプリが依存しているもの

npm（registry）:

| パッケージ | 所有者 | 利用中 | npm 最新 | 更新 |
| --- | --- | --- | --- | --- |
| `fcpx-audio-role-encoder` | taku-o | 0.1.2 | 0.1.4 | 可能。D-2 で上げる |
| `github-version-compare` | taku-o | 0.1.0 | 0.1.0 | これ以上の版はない |
| `wav-audio-length` | taku-o | 0.1.1 | 0.1.1 | これ以上の版はない |
| `wav-fmt-validator` | taku-o | 0.1.2 | 0.1.2 | これ以上の版はない |

GitHub 直指定（タグが最新コミットと一致。2020-06 が最終）:

| パッケージ | 指定 | 最新タグ | 更新 |
| --- | --- | --- | --- |
| `electron-path` | `myukkurivoice/electron-path#0.1.4` | 0.1.4 | 新しいタグはない |
| `myukkurivoice-about-window` | `myukkurivoice/myukkurivoice-about-window#v1.14.3` | v1.14.3 | 新しいタグはない |
| `caller-position` | `myukkurivoice/caller-position#0.1.4` | 0.1.4 | 新しいタグはない |
| `electron-performance-monitor` | `myukkurivoice/electron-performance-monitor#0.2.3` | 0.2.3 | 新しいタグはない |

これらは「最新へ上げる」作業は発生しない。Electron 更新で壊れたら、各リポジトリ側を直してからタグを切る。

vendor / ネイティブ（版上げではなく arm64 再ビルド）:

| もの | リポジトリ | 扱い |
| --- | --- | --- |
| `vendor/` | `myukkurivoice/myukkurivoice-vendor` | 自作 submodule。評価版 SDK と自作 CLI を入れる |
| `maquestalk1` | `myukkurivoice/maquestalk1`（Desktop の clone 表記は taku-o） | Mac AT1 評価版向けに直す。新 API: `Synthe_Utf8` + 声種 dylib |
| `maquestalk1-ios` | `myukkurivoice/maquestalk1-ios` | 今は使わない。Mac AT1 が足りないと分かるまで対象外 |
| `secret` | `myukkurivoice/myukkurivoice-secret` | arm64 で `go build` |

#### アプリの依存ではない関連リポジトリ

- `taku-o/fcpx-audio-role-workflow` — ヘルプからリンクする別アプリ。本体の package.json には無い
- `taku-o/gitignore-merge` — kiro 初期セットアップ用。アプリ実行には使わない

`zosui` はリリースノートに過去の言及があるだけで、現行コードからは参照していない。

### 5.9 Git ブランチ規則（複数リポジトリ）

今回の作業は本体に加え、vendor と自前ライブラリなど複数リポジトリにまたがる。ブランチの切り方を揃える。

- 起点: そのリポジトリに `develop` があれば `develop`。なければ `master`
- 作業ブランチ名: 本体 `myukkurivoice` で今使っている名前に合わせる。**今回は `feature/applecpu/master`**
- `develop` および `master` の上では直接コミットしない
- 作業ブランチが既にあるリポジトリ（本体は既に `feature/applecpu/master`）は、それを継続して使う
- `staging` は本体の公開用ブランチであり、他リポジトリの起点には使わない
- コミットするとき、`.kiro/specs/00-planing/prompt.md` が staging にあるなら、同じコミットに入れる。外さない

調査時点で公開リポジトリのデフォルトはいずれも `master` のみ（`electron-path`、`about-window`、`caller-position`、`electron-performance-monitor`、`fcpx-audio-role-encoder` など）。`maquestalk1` / `secret` / `vendor` はプライベートのため、作業開始時に `develop` の有無を確認する。

```
git fetch origin
git switch develop 2>/dev/null || git switch master
git switch -c feature/applecpu/master
```

## 6. 開発の進め方

cc-sdd（kiro）の承認ゲートを守る。この `planning.md` の次の文書（requirements / design / tasks）は、ユーザーが作成を指示するまで作らない。承認もユーザーが行う。

### 手順 0. この計画の確認

- 対象範囲、やらないこと、スペック分割の単位を確認する
- CPU 対応は **arm64 のみ** で確定済み。Intel / Universal は対象外
- AquesTalk は現行 vendor に arm64 がないため更新する。vendor は自作（`myukkurivoice-vendor`）。開発は評価版 SDK を使う。置き場 `~/Desktop/myukkurivoice-lib`。形式は dylib。AquesTalk1 は Mac 評価版。iOS は最後の手段
- 独立ライブラリは、同じメジャー / パッチは上げる。メジャーが飛ぶもの（`intro.js` を含む）は可能なら上げる。干渉して動かない場合は報告して対応を決める
- UI は、バージョンアップに伴う多少の変化を許容する。大幅な変更はしない。`intro.js` のチュートリアル UI 変更は試みる
- 自前プロジェクトは `develop`（なければ `master`）から `feature/applecpu/master` を切って作業する

### 手順 1. 調査（実装に入る前）

実装より先に、実物で確認する。結果は後続スペックの requirements / design に書く。

**切り分け:** スニペット / CLI 1本で確かめられるものは NOW。アプリ全体・パッケージング・公証・本物の renderer が要るものは LATER。

1. AquesTalk 評価版 SDK（Apple Silicon）のパス、関数シグネチャ、辞書・phont、サンプリングレート → **棚卸し済み**（パス `~/Desktop/myukkurivoice-lib`、形式は dylib）。WAV 実測は未実施。talk2 の古い 3 phont は新評価版で Synthe できる
2. `maquestalk1` の Mac AT1 リンク試験は実施済み（要作業。SDK は足りる。現行 CLI はそのままでは不可）。**製品ビルドは THEN**（CLI の書き換えが要る）。`secret` の arm64 `go build` は NOW（SDK 非依存）。**iOS SDK と `maquestalk1-ios` は、Mac AT1 が足りないと分かるまで対象外**
3. 選ぶ FFI（koffi 想定）で、評価版 dylib の Synthe / FreeWave が呼べるか → NOW（`/tmp` の最小呼び出し）。本番 renderer の中での置き換えは THEN / LATER
4. 到達 Electron の版。公証できるかをアプリごとパッケージして決めること → **LATER**
5. 現行 `electron.remote` の棚卸し → NOW（読み取りだけ）。`@electron/remote` への上げと、それが足りるかの実行確認は THEN

調査で設計が成立しない場合は、実装を変えずに報告する。

### 手順 2. スペックに分割する

1つの巨大スペックにしない。依存の波で分ける。各スペックは requirements → design → tasks → 実装。工程ごとに人間が承認する。

推奨する分割（名前は作業用。確定は手順 0）:

| 順 | 内容 | 依存 |
| --- | --- | --- |
| 1 | `maquestalk1` を Mac AT1 新 API 向けに直す | NOW 調査、リンク試験 |
| 2 | `myukkurivoice-vendor`（評価版 SDK、自作 CLI、talk2 追加 3 phont、`secret` arm64） | スペック 1 |
| 3 | FFI 置き換え（koffi） | NOW の koffi 最小呼び出し、スペック 2 のパス |
| 4 | `electron.remote` → `@electron/remote` | NOW の remote 棚卸し |
| 5 | Electron / Node 更新 | スペック 3 と 4。公証できる版決めは LATER |
| 6 | arm64 パッケージング・署名・公証・MAS | スペック 5 |
| 7 | Spectron から Playwright へのテスト移行 | スペック 6 の成果物パス。テスト変更の許可が必要。移行そのものは LATER |
| 8 | CI / 開発手順の更新 | スペック 5 と 7 |
| 9 | 独立ライブラリの個別更新 | スペック 5 の後が安全。ライブラリごとに小さく切る |

スペック 9 は「まとめて最新化」しない。1ライブラリ（または密結合の1組）を1スペックまたは1タスクにする。同じメジャー / パッチは上げる。メジャーが飛ぶものは可能なら上げ、干渉したら報告する。

### 手順 3. 実装時の約束

- ドキュメントにない機能を足さない
- 一時実装・ダミー・未使用パスのコメントアウトで「対応した」ことにしない
- 一括変換スクリプトは使わない。許可があるとき以外、sed による一括置換もしない
- テストコードは許可なく変更しない
- 既存テストが落ちた理由を無視しない。理由がある失敗でも動作確認 OK にしない
- 設計どおりに進まないときは実装を変えず、報告する
- ライブラリを上げて他と干渉した場合も、コメントアウトや黙った差し戻しで「対応した」ことにしない。報告して対応を決める
- 他リポジトリを触るときは、`develop`（なければ `master`）から `feature/applecpu/master` を切る。本体と同じブランチ名にする

### 手順 4. 受け入れ

- テストできる機能には単体テストを用意する
- 画面のある機能には Playwright のテストを用意する（移行後）
- 既存テストが新たに失敗しないことを確認する
- 目視できる変更（配布物名、ヘルプのダウンロード手順、起動、音声再生・録音、バージョンアップに伴う UI の変化、intro.js チュートリアル）は、ユーザーが確認できる形で残す

## 7. 作業量の見立て（順序の判断用）

正確な工数は調査後に出す。大きさの目安だけ記す。

| 領域 | 大きさ | 理由 |
| --- | --- | --- |
| AquesTalk vendor | 中〜大 | 自作 `myukkurivoice-vendor` の更新。評価版 SDK の形式・API 差分。有償ライセンスは後で判断 |
| FFI 置き換え | 大 | 音声生成の中核。ポインタとバッファ寿命 |
| Electron / remote | 大 | API 削除が多く、Renderer 全体に remote がある |
| パッケージング・署名 | 中 | パスとツール名の置換が広いが、アプリ論理は少ない |
| テスト Playwright 化 | 大 | Spectron テストファイルが多い。許可が必要 |
| CI / Node | 中 | 古い Action と Node 12 固定 |
| 独立ライブラリ | 小〜中 | 同じメジャーは小。メジャーアップは中。干渉時は都度判断 |

## 8. リスク

- `vendor/` は自作リポジトリ `myukkurivoice-vendor`。アクエスト製バイナリと自作 CLI の組み立て場所。本体アプリとは別リポジトリで更新する
- `maquestalk1` は自作 CLI。Mac AT1 評価版に合わせて、`Synthe_Utf8` + 声種 dylib で arm64 ビルドし直す必要がある。現行の `SyntheMV` + framework のままではリンクできない
- `maquestalk1-ios` は今は使わない。戻す条件は、Mac AT1 で現行 talk1 が成立しないと証明されたとき
- `secret` は自作の Go CLI（https://github.com/myukkurivoice/myukkurivoice-secret）。arm64 向けに `go build` し直す
- 評価版 SDK の形式は **dylib**（確認済み）。サンプリングレートが現行と違うと、パス変更と音声の見え方が変わる
- 評価版はナ行・マ行がヌになる。開発確認ではそれで足りる。配布物には評価版を入れない
- AqKanji2Koe が AqKanji2Koe-A に変わっている。辞書まわりの差分がある可能性
- koffi（または選定した FFI）が、到達 Electron で WAV バッファを正しく返せない
- `nodeIntegration: true` を残すため、新しい Electron のデフォルト（contextIsolation）とは逆の設定になる。警告は出るが、本計画では許容する
- GitHub Actions の `macos-latest` が Apple Silicon のため、旧 x64 ビルドが調査前から既に落ちている可能性がある
- `intro.js` 8 に合わせたチュートリアル UI の変更が、既存の案内手順と一致しない可能性がある
- 他ライブラリのバージョンアップで、グリッド等の見た目が多少変わる可能性がある（許容範囲。大幅なら報告）
- mocha / chai / eslint のメジャーアップはテストコード変更を伴う可能性がある（許可が必要）
- `gulp-typescript` 6 は alpha。安定版がなければ上げない
- `gulp-eslint` 6 が最終版。それ以上は別パッケージへの置き換えになり、干渉時の判断対象になる

## 9. 次のアクション

順序の正本は「いまここ」と Project store `docs/upcoming-work.md`。

1. NOW: `secret` の arm64 `go build`。koffi 最小 Synthe / FreeWave。`electron.remote` の棚卸し（上げない）
2. THEN: `maquestalk1` 新 API → vendor（追加 phont 含む）→ FFI koffi → `@electron/remote` → Electron / Node → arm64 パッケージ・署名・公証・MAS → テスト（Playwright は許可が必要）→ CI → 独立ライブラリ 1 件ずつ
3. LATER: 公証できる Electron をアプリごとパッケージして決める。本番 renderer の FFI。本番 MAS / 署名。Playwright 移行そのもの
4. 指示があるまで `requirements.md` / `design.md` / `tasks.md` / `spec.json` は作らない
5. 調査結果を見て、手順 2 のスペック分割を確定する
