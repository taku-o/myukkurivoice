# Project Structure

## Organization Philosophy

ウィンドウ（画面）単位でコードを整理する。Main プロセスのファイルはルートに、  
Renderer プロセスのファイルは `/js/` に配置する。

## Directory Patterns

### Main Process（Electron）
**Location**: `/` (ルート)  
**Purpose**: Electron の Main プロセスのエントリポイントとモジュール  
**Pattern**: `electron.ts`（エントリ）、`electron-{機能}.ts`（モジュール分割）  
**Example**: `electron-menu.ts`, `electron-shortcut.ts`, `electron-window.ts`

### Renderer Process（AngularJS）
**Location**: `/js/`  
**Purpose**: 各ウィンドウの AngularJS コンポーネント群  
**Pattern**: `{レイヤー}.{ウィンドウ/機能}.ts`

レイヤーと役割:
- `apps.*` — Angular モジュール定義、ウィンドウエントリポイント
- `ctrl.*` — Angular コントローラ（UI イベントハンドリング）
- `directive.*` — Angular ディレクティブ
- `events.*` — イベントハンドラ定義
- `models.*` — Angular スコープモデル
- `reducers.*` — 状態更新ロジック（Redux ライク）
- `stores.*` — 状態ストア
- `service-{名前}.ts` — ビジネスロジックサービス（ハイフン区切り）
- `services.*` — Angular サービス登録

### スタイルシート
**Location**: `/css/`  
**Purpose**: ウィンドウごとの LESS ファイルと、コンパイル済み CSS  
**Pattern**: `{ウィンドウ名}.less` / `{ウィンドウ名}.css`  
**Example**: `main.less`, `dict.less`, `help.less`

### テスト
**Location**: `/test/`  
**Purpose**: ユニットテスト・E2E テスト  
**Pattern**: `{対象ファイル名}.ts`（テスト対象と同じ命名）

### ウィンドウ HTML
**Location**: `/` (ルート)  
**Purpose**: 各ウィンドウのコンテンツ HTML  
**Pattern**: `contents-{ウィンドウ名}.html`

## Naming Conventions

- **TypeScript ファイル（js/）**: `{レイヤー}.{ウィンドウ}` または `{レイヤー}-{機能}` のドット/ハイフン区切り
- **Angular サービス（service-）**: ハイフン区切り（例: `service-aques-AquesTalk1.ts`）
- **Angular コンポーネント（ctrl/apps/stores）**: ドット区切り（例: `ctrl.main.ts`）
- **CSS/LESS**: ウィンドウ名（例: `main.less`）

## Code Organization Principles

- **ウィンドウ単位の分離**: main / dict / help / helpsearch / system ウィンドウそれぞれに独立したコンポーネント群
- **レイヤー分離**: apps（定義）→ ctrl（UI）→ reducers（ロジック）→ stores（状態）の流れ
- **サービス層**: `service-*.ts` がビジネスロジックを担い、コントローラはUI操作のみ
- **AquesTalk 抽象化**: `service-aques.ts` が各バージョン（AquesTalk1/2/10）の差異を吸収

---
_Document patterns, not file trees. New files following patterns shouldn't require updates_
