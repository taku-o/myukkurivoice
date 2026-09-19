# 小さい調査パス（NOW）

taku-o 向け。観測日: 2026-09-18。ホスト: arm64。

方針: 開発の前に調査する。アプリ全体を作らないと確かめられない調査は後回し。

実装はしていない。`maquestalk1` / アプリは書き換えていない。SDK バイナリは git / store に入れていない。`@electron/remote` へは上げていない。

作業順の正本: [upcoming-work.md](./upcoming-work.md)

## NOW vs LATER

| 項目 | 判定 | 理由 | このパス |
| --- | --- | --- | --- |
| `secret` の arm64 `go build` | **NOW** | SDK 非依存。CLI 1本 | 実施。arm64 で動く |
| 評価版 dylib を koffi で Synthe / FreeWave | **NOW** | `/tmp` のスニペット | 実施。AT1 f1 / AT2 / AT10 とも WAV が出る |
| 現行 `electron.remote` の棚卸し | **NOW** | 読み取りだけ | 実施。上げていない |
| AqKanji2Koe の Convert スニペット | NOW にできる | CLI 1本で足りる | 実施。**works**。[survey-aqkanji2koe.md](./survey-aqkanji2koe.md) |
| `maquestalk1` を新 API で製品ビルド | しない | CLI は書き直さない。THEN 2 で捨てる | していない |
| 本番 renderer の中の FFI | **LATER** | 本物の Electron アプリが要る | していない |
| 公証できる Electron の版をアプリごと決める | **LATER** | ほぼ全体のパッケージが要る | していない |
| `@electron/remote` への上げ | THEN（実装） | 棚卸しのあと。実行確認は Electron 更新が要る | していない |
| 本番 MAS / 署名 | **LATER** | パッケージング後 | していない |
| Playwright へのテスト移行そのもの | **LATER** | 許可と成果物パスが要る | していない |

## 1. secret arm64 `go build`

パス: `/Users/taku-o/Desktop/myukkurivoice-secret`（`src/secret/secret.go`）

- ホスト Go: 1.23.4 `darwin/arm64`
- `go.mod` は無い。`go build` はそのままだと main module エラー
- 回避（リポジトリは未変更）: `GO111MODULE=off go build -o /tmp/applecpu-now-survey/secret-arm64 secret.go`
- 成果物: Mach-O arm64。`/tmp` のみ。git に入れてない
- checkout 内の既存 `src/secret/secret` は **x86_64 のまま**。上書きしていない
- 実行（キー本文は出さない）:
  - `-key=passPhrase` → 80 byte
  - `-key=aqKanji2KoeDevKey` → 793 byte
  - `-key=aquesTalk10DevKey` → 793 byte
  - 未知 / 引数なし → 0 byte

本体 `vendor/secret` も現行は x86_64。差し替えは THEN の vendor 作業。

## 2. koffi 最小 Synthe / FreeWave

場所: `/tmp/applecpu-now-survey/koffi-probe`（koffi **3.3.0**、ホスト Node **v24.7.0**）

これは **ホスト Node**。Electron renderer ではない。本番アプリの中で同じ呼び出しが通るかは LATER / THEN。

入力 koe: `こんにちわ`（評価制限のナ行・マ行を避ける）。speed 100。`SetDevKey` なし。

| エンジン | dylib | Synthe | FreeWave | WAV |
| --- | --- | --- | --- | --- |
| AT1 f1 | `libAquesTalk1-f1.dylib` | 非 NULL `size=12676` | 呼んだ | 8kHz / 16bit / mono。`maxabs=32216` `rms=8226` |
| AT2 `aq_f1c` | `libAquesTalk2Eva.dylib` | 非 NULL `size=12676` | 呼んだ | 8kHz / 16bit / mono。`maxabs=32767` `rms=8538` |
| AT10 F1（`fsc=100`） | `libAquesTalk10.dylib` | 非 NULL `size=25148` | 呼んだ | **16kHz** / 16bit / mono。`maxabs=27943` `rms=7139` |

silent fail（RIFF でない / PCM 全部 0）ではない。

WAV は `/tmp/applecpu-now-survey/koffi-at*.wav` にだけ書いた。store / git には入れてない。

AT2 の `maxabs` / `rms` は、以前の [survey-talk2-phonts.md](./survey-talk2-phonts.md) の `aq_f1c` 対照と一致。

**AT10 の 16kHz は、このスニペットで実測した。** ヘッダ・マニュアルどおり。アプリの再生経路（8000Hz 前提）はまだ見ていない（LATER / THEN）。

koffi の注意（実装時）: 戻りを `uint8 *` にして `koffi.view` すると先頭 8 byte が壊れる。`void *` 戻り + `koffi.decode(ptr, 'uint8_t', size)` なら RIFF が取れる。

## 3. `electron.remote` 棚卸し（上げていない）

`package.json` に `@electron/remote` は **無い**。現行は Electron 6 の `require('electron').remote`。

Main 側: `electron-window.ts` の 6 窓すべて `enableRemoteModule: true`

- main / help / helpSearch / system / dict / spec

Renderer が使っている remote API（ソース `js/`。ヘルプ用 `docs/assets/js/reducers.help.js` は生成物）:

| API | 使い方 | ファイル |
| --- | --- | --- |
| `remote.app` | `getPath`（desktop / music / userData / home） | `service.util.ts` `service.data.ts` `service.aques.ts` `reducers.main.ts` `reducers.help.ts` `reducers.dict.ts` `apps.main.preload.ts` |
| `remote.app` | `addRecentDocument` / `clearRecentDocuments` / `startAccessingSecurityScopedResource` | `reducers.main.ts` |
| `remote.getGlobal('appCfg')` | 設定の読み | `reducers.system.ts` `reducers.main.ts` |
| `remote.getCurrentWindow()` | `focus` / `close` / `hide` / `previewFile` / `isAlwaysOnTop` / `setAlwaysOnTop` / `setDocumentEdited` / `setTitle` | `reducers.main.ts` `reducers.system.ts` `reducers.dict.ts` `ctrl.helpsearch.ts` |
| `remote.getCurrentWindow().getParentWindow().webContents` | `findInPage` / `stopFindInPage` | `reducers.helpsearch.ts` |
| `remote.require('console')` | `CONSOLELOG` 時に renderer の console を差し替え | `apps.*.ts` `apps.main.preload.ts` `apps.spec.ts` |

`js/service.audio.ts` は `app.getPath` を使うが、そのファイル内に `remote.app` の require が無い。他ファイルの `var app` に頼っている。置き換え時に落ちる種。

dialog / Menu / BrowserWindow を remote から直接は使っていない。

`@electron/remote` がこの一覧を覆うかは、**目視では足りそう**。実行確認は Electron を上げたあと（THEN）。このパスでは上げていない。

## ブロッカー

当初 NOW 3件を止めるブロッカーは無い。Convert は [survey-aqkanji2koe.md](./survey-aqkanji2koe.md)。

メモ（止めない）:

- `secret` に `go.mod` が無い。THEN の製品ビルドでモジュール化するかどうかは後で決める
- koffi はホスト Node 24 で通った。選んだ Electron の中はまだ
- AT10 は 16kHz。アプリ再生が 8kHz 前提のままなら、THEN でパスを直す必要がある

## やっていないこと

- `maquestalk1` / アプリの書き換え
- vendor へのバイナリ投入
- `@electron/remote` の導入
- Electron のパッケージ・公証
- SDK / WAV / secret バイナリの git / store コピー
- `requirements.md` / `design.md` / `tasks.md` / `spec.json`
