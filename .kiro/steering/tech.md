# Technology Stack

## Architecture

Electron デスクトップアプリ。Main プロセス（Node.js）と Renderer プロセス（AngularJS）が分離されており、  
IPC を通じて通信する。AquesTalk ネイティブライブラリは ffi-napi で Main プロセスから呼び出す。

## Core Technologies

- **Language**: TypeScript（一部 JavaScript）
- **Framework**: Electron 6.x + AngularJS 1.x
- **Runtime**: Node.js v12
- **Build**: Gulp（TypeScript コンパイル、LESS コンパイル、パッケージング）
- **CSS Preprocessor**: LESS → CSS

## Key Libraries

- **UI**: AngularJS 1.7、angular-ui-grid（設定グリッド）、intro.js（チュートリアル）
- **Native連携**: ffi-napi、ref-napi（AquesTalk DLL/dylib 呼び出し）
- **データ永続化**: electron-store、electron-json-storage
- **テスト**: Mocha + Chai（ユニット）、Spectron（E2E）

## Development Standards

### Type Safety

TypeScript を使用。現時点では移行期として一部設定を緩和:
- `noImplicitAny: false`（一時的）
- `strictNullChecks: false`（一時的）
- `alwaysStrict: true` は有効

### Code Quality

ESLint（TypeScript ファイルは `@typescript-eslint/parser`）:
- シングルクォート必須
- セミコロン必須
- `comma-dangle: always-multiline`
- TypeScript ファイルでは `no-console: error`

### Testing

- ユニットテスト: Mocha + Chai（`test/` ディレクトリ）
- E2E テスト: Spectron
- Gulp タスクでテスト実行: `gulp test`

## Development Environment

### Required Tools

- Node.js v12+
- Gulp CLI
- Xcode（ネイティブモジュールビルド用）

### Common Commands

```bash
# Dev（TypeScriptコンパイル + ビルド）: gulp build
# Test: gulp test
# Lint: gulp lint
# Gulp タスク一覧: npm run tasks
```

## Key Technical Decisions

- **AngularJS 1.x 採用**: 開発開始時の選択。Redux ライクなパターン（reducers + stores）で状態管理を整理。
- **ffi-napi での Native 連携**: AquesTalk は macOS ネイティブライブラリのため、Node.js から直接呼び出す。
- **LESS → CSS**: スタイルはウィンドウごとに独立したファイルで管理。

---
_Document standards and patterns, not every dependency_
