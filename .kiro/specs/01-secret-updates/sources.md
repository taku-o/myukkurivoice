# THEN 1-1 ソースと現行バイナリ（実測）

2026-09-19。`lipo -info` / `file` / `cmp` / `shasum -a 256` / `go version` / `ls`。パスはディスク上の実在だけ。推測のフォルダ名は作っていない。

調査の説明は [../00-planing/survey-small-pass.md](../00-planing/survey-small-pass.md)。ここは 1-1 用の実測。00-planing を再掲しない。

## 作業先

`/Users/taku-o/Desktop/myukkurivoice-secret`  
ブランチ `feature/applecpu/master`（作業ツリーはきれい。起点 `master` `0ae39705aef2f52e7525fe4f2366e5983d49407b` = `origin/master`。origin のブランチは `master` のみ。`feature/applecpu/master` は未 push）

ツリー（実在）:

```
/Users/taku-o/Desktop/myukkurivoice-secret/README.md
/Users/taku-o/Desktop/myukkurivoice-secret/src/secret/secret.go
/Users/taku-o/Desktop/myukkurivoice-secret/src/secret/secret
```

`go.mod` / `go.sum` はリポジトリ内に **無い**。

## ソース

`/Users/taku-o/Desktop/myukkurivoice-secret/src/secret/secret.go`

`package main`。import は `flag` と `fmt` のみ。キー本文はここに書かない。

リポジトリ README のビルド例は `cd src/secret/` のあと `go build`。現行ホストでは `go.mod` が無いため、調査では `GO111MODULE=off` が要った。製品でも今は `go.mod` を足さない。

## ビルド条件（調査。ホスト再確認 2026-09-19）

| 項目 | 値 |
| --- | --- |
| Go | 1.23.4 `darwin/arm64`（`go version`） |
| `GO111MODULE` | 環境変数は空。Go 1.23 のモジュール前提 |
| GOPATH | `/Users/taku-o/go`（この clone は GOPATH 配下ではない） |
| 調査時のコマンド | `GO111MODULE=off go build -o /tmp/applecpu-now-survey/secret-arm64 secret.go`（`src/secret` で実行。リポジトリ未変更） |
| 調査時の成果 | Mach-O arm64。`/tmp` のみ |

製品の `-o` は secret リポジトリ内。`/tmp/applecpu-now-survey/secret-arm64` を採用しない。

## 現行バイナリ（成果物にしない）

| 何 | パス | arch | sha256 |
| --- | --- | --- | --- |
| checkout | `/Users/taku-o/Desktop/myukkurivoice-secret/src/secret/secret` | x86_64（non-fat） | `263aa4a7f92ffb9b2d7c82ad9a2860e2740eb47c0b8862540de82db6948d0bd2` |
| vendor clone | `/Users/taku-o/Desktop/myukkurivoice-vendor/secret` | x86_64（non-fat） | 同上。checkout と `cmp` 一致 |
| 本体 submodule | `/Users/taku-o/Desktop/myukkurivoice/vendor/secret` | x86_64（non-fat） | 同上。checkout と `cmp` 一致 |
| 調査残骸（採用しない） | `/tmp/applecpu-now-survey/secret-arm64` | arm64（non-fat） | `5d7f88bef72ef406e68241adff3751ffff7a178d910698f7d28f335ce002b1ad` |

checkout / vendor clone / 本体 submodule の `secret` は三者ともサイズ 2,283,536 byte、sha256 一致。調査残骸はサイズ 2,350,098 byte、sha が違う。

`file`: checkout は `Mach-O 64-bit executable x86_64`。調査残骸は `Mach-O 64-bit executable arm64`。

## 成果物（このタスク）

secret リポジトリ内の Mach-O **arm64**。確認は `lipo -info`。vendor へは出さない（THEN 1-2）。

## コピーしないもの（このタスク）

| 対象 | 理由 |
| --- | --- |
| checkout の x86_64 `secret` | 更新前バイナリ |
| `/tmp/applecpu-now-survey/secret-arm64` | 調査残骸。製品ではない |
| vendor clone / 本体 `vendor/secret` への上書き | THEN 1-2 |
| 評価版 SDK（`/Users/taku-o/Desktop/myukkurivoice-lib`） | THEN 1-2。今は読まない |
| `maquestalk1` / `maquestalk1-ios` | このタスクの対象外 |
