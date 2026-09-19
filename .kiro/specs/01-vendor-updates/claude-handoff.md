# Claude Code 引き渡し（THEN 1）

先に [../00-planing/resume.md](../00-planing/resume.md) と [../00-planing/upcoming-work.md](../00-planing/upcoming-work.md) を読む。計画の再掲はしない。パスの正本は [sources.md](./sources.md)。索引は [README.md](./README.md)。

この作業は **vendor ファイル投入**。cc-sdd の実装コマンドではない。

## やること

リポジトリ: `/Users/taku-o/Desktop/myukkurivoice-vendor`  
ブランチ: `feature/applecpu/master`（ローカル作成済み。`master` `4e211a0` から。origin 未 push）

THEN 1 で vendor に置くもの（upcoming-work の定義）:

1. **評価版 SDK**（Mac 4 本）。元は `/Users/taku-o/Desktop/myukkurivoice-lib` の展開済みフォルダ。dylib / ヘッダ / マニュアル / 公式 phont / 辞書。現行と同じ二層（SDK パッケージ用フォルダ + アプリが読むルート）
2. **AT1 声種 dylib** 9 本（`lib/libAquesTalk1-XX.dylib`）。アプリが今使うのは f1 / m1 だけだが、評価版 `lib/` の 9 声種を入れる。サンプル配下の複製は入れない
3. **`secret` の arm64**。ソースは `/Users/taku-o/Desktop/myukkurivoice-secret/src/secret/secret.go`。checkout 内の `secret` バイナリは **x86_64** なのでそれをコピーしない。ホストで arm64 をビルドして `myukkurivoice-vendor/secret` に置く
4. **talk2 追加 3 phont**（`aq_defo1` / `aq_momo1` / `aq_teto1`）。公式評価版には無い。現行 `vendor/phont/` から。公式 14 種を評価版で置き換えるとき、この 3 つを落とさない

評価版のファイル名は変えない（評価版 readme: 改変・ファイル名変更を禁ずる）。

現行 vendor はアクエスト製 SDK を同じ private リポジトリに既に持っている。評価版を **vendor リポジトリへ** 置くのは、その続き。再配布禁止の扱いも今と同じ。

## 制約

- 評価版 SDK を **Project store** にコピーしない
- 評価版 SDK を **`myukkurivoice` の git ツリー** にコピーしない（submodule ポインタ以外。本体へバイナリを直置きしない）
- 評価版の再配布禁止。公開リポジトリ・store・本体ソースツリーへ出さない。行き先は `myukkurivoice-vendor` だけ
- 本体アプリのコード（`js/`、gulp、テスト）を書き換えない
- `maquestalk1` を新 API 向けに書き直さない
- CLI バイナリ（`maquestalk1` / `maquestalk1-ios`）を vendor に入れない
- iOS SDK を取らない・足さない（評価版 drop にも無い）
- `/kiro-*` を走らせない。`/kiro-spec-init` も `/kiro-impl` も使わない
- `requirements.md` / `design.md` / `tasks.md` / `prompt.md` / `spec.json` を作らない
- `at1-koffi-direct` を再作成しない
- 作業メモは `.kiro/specs/01-vendor-updates/` だけ。vendor / secret / maquestalk1 リポジトリに散らさない
- 一括 sed でパスを書き換えない
- 「完了」「complete」をユーザー許可なく使わない
- commit / push は taku-o が明示したときだけ

## 対象外（THEN 2 以降・やらない）

- **THEN 2:** talk1 の呼び方。`maquestalk1` / `maquestalk1-ios` を捨て、AT1 dylib をプロセス内直呼び。CLI は書かない
- **THEN 3:** AT2 / AT10 / AqKanji2Koe の `ffi-napi` → `koffi`。vendor 差し替えではない
- gulp の unpacked コピー、asar ignore、`DynamicLibrary` パス、署名パス
- Electron / Node / `@electron/remote` / パッケージ / テスト / CI
- 本体の submodule SHA 追従（vendor 側のコミット後、taku-o 指示があってから）
- 有償ライセンスの購入判断
- 評価版 DMG（`AquesTalk評価版dmg/`）の vendor 投入。現行 vendor に DMG は無い
- `.DS_Store`
- `/tmp/applecpu-now-survey/secret-arm64` を製品バイナリとして採用すること（調査残骸。ソースから建て直す）

## `secret` のビルド（調査済みの手順）

調査: [../00-planing/survey-small-pass.md](../00-planing/survey-small-pass.md)

- ホスト: Go 1.23.4 `darwin/arm64`（2026-09-19 再確認）
- `go.mod` は無い。製品でモジュール化するかは後で決める。今は足さない
- 調査時: `GO111MODULE=off go build -o … secret.go`（リポジトリ未変更）
- 成果物は Mach-O **arm64**。`lipo -info` で確認してから `myukkurivoice-vendor/secret` へ
- checkout の `/Users/taku-o/Desktop/myukkurivoice-secret/src/secret/secret` は x86_64。vendor 現行 `secret` と `cmp` 一致。これを上書きコピーしない

## 現行ファイルをどうするか

- ルートの `.framework` の中に dylib をねじ込まない（形式が違う）
- 新規に `maquestalk1` / `maquestalk1-ios` を足さない。iOS パッケージ `aqtk1-ios/` も更新しない
- 古い i386 / x86_64 バイナリを残すか消すかは、投入時に taku-o へ確認する。この引き渡しでは削除を自己判断しない
- `phont/` の公式 14 種は評価版と **バイト一致**（2026-09-19 `cmp`）。追加 3 種は現行のまま残す

## 確認の目安（アプリ起動は THEN 1 の範囲外）

- vendor clone 上で、投入した dylib が評価版と同じ arch（[sources.md](./sources.md) の表）
- AT1 は声種 dylib が `lib/` 由来のファイル名のまま
- `secret` が arm64
- `phont/` に公式 14 + 追加 3 がある
- 本体 `myukkurivoice` の working tree に `.dylib` が増えていない
- Project store に SDK が無い
