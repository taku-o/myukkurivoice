# Claude Code 引き渡し（THEN 1-1）

索引は [README.md](./README.md)。パスと arch の正本は [sources.md](./sources.md)。00-planing は読んだ前提。調査の再掲はしない。入口: [../00-planing/survey-small-pass.md](../00-planing/survey-small-pass.md)。

**このタスク:** `myukkurivoice-secret` を arm64 に更新する。vendor へは出さない。

## やること

リポジトリ: `/Users/taku-o/Desktop/myukkurivoice-secret`  
ブランチ: `feature/applecpu/master`（ローカル作成済み。`master` `0ae39705aef2f52e7525fe4f2366e5983d49407b` から。origin には無い）

1. `src/secret/secret.go` から arm64 の Mach-O を、**secret リポジトリ内**に置く
2. 調査と同じく `GO111MODULE=off`。`go.mod` は無い。足さない
3. 成果物を `lipo -info` で **arm64** と確認する
4. 作業メモは `.kiro/specs/01-secret-updates/` だけ。secret リポジトリへメモを書かない

調査時のビルド（リポジトリ未変更。出力先は調査用 `/tmp`。**製品にしない**）:

```
cd /Users/taku-o/Desktop/myukkurivoice-secret/src/secret
GO111MODULE=off go build -o /tmp/applecpu-now-survey/secret-arm64 secret.go
```

製品の出力先は `/tmp` ではない。secret リポジトリ内（現行バイナリと同じ場所なら `src/secret/secret`）。上の `-o /tmp/...` を製品パスにしない。

## やらないこと

- checkout の x86_64 `src/secret/secret` を成果物として残す・コピーする
- `/tmp/applecpu-now-survey/secret-arm64` を製品バイナリにする（調査残骸。sha も場所も製品ではない）
- `go.mod` を足す。モジュール化するかは後で決める
- vendor へ secret をコピーする（**THEN 1-2。次。このタスクではない**）
- 評価版 SDK を `myukkurivoice-vendor` へ置く（同上）
- 本体アプリ（`js/`、gulp、テスト）の書き換え
- `maquestalk1` / `maquestalk1-ios` を触る・vendor に入れる
- 評価版を store / `myukkurivoice` git ツリーへ置く
- `at1-koffi-direct` を再作成する
- secret / vendor / maquestalk1 リポジトリへ作業メモを散らす
- キー本文をこのフォルダやログに書き出す
- 「完了」「complete」をユーザー許可なく使う
- commit / push（taku-o が明示したときだけ）

評価版の配布経路コメントアウト、辞書 `aq_dic_large`、AT10 [#299](https://github.com/taku-o/myukkurivoice/issues/299) は、このタスクでは触らない。

## 次（このタスクではない）

**THEN 1-2:** `myukkurivoice-vendor` へ評価版 SDK と、このタスクで更新した secret の成果物をコピーする。そこで secret を建て直さない。今はコピーしない。

## 確認の目安（アプリ起動は範囲外）

- secret clone 上の成果物が Mach-O **arm64**（`lipo -info` / `file`）
- 成果物が checkout 当時の x86_64 ではない（[sources.md](./sources.md) の sha256）
- 成果物が `/tmp/applecpu-now-survey/secret-arm64` のコピーではない
- vendor clone / 本体 `vendor/secret` はまだ触っていない
- 本体 `myukkurivoice` の working tree に `.dylib` が増えていない
