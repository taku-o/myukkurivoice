このプロジェクトで生成するアプリはMacのIntel CPU環境用となっていて、
未対応のままなら、いずれ動かなくなると想定される。

またコードで利用されているライブラリがかなり古い状態ともなっている。
なのでいくつかのライブラリは新しいバージョンに更新したい。

angular.jsについては開発が止まっているし、
これを置き換えると変更が大きすぎるので、このまま利用することにする。

以上の想定で、
どのような作業が発生するか、
どのような手順で開発を進めていけば良いか、
を検討してください。

まとめた内容は
.kiro/specs/00-planing/planning.md
に出力してください。

Intel Macはなくなるので、最新版のアプリでの対応はarm64 のみにする

ライブラリの一覧を出して
> 残っている確認は、独立して更新するライブラリの初期リストです。調査スペックの作成は、指示があるまで待ちます。


> D-2. 同じメジャー、またはパッチ程度
はバージョンを上げちゃおう。

> D-3. メジャーが飛ぶ（差分確認が必要）
は可能ならバージョンを上げる。
バージョンを上げて、他と干渉して動かなかったら対応を考える。

intro.jsも一応頑張ってバージョンを上げてみる方針で。

intro.jsのバージョンアップ対応はチュートリアルUIの変更も試みる。
他も大幅にはUIを変えたくないが、多少ならバージョンアップによるUI変更を許容する。

調査スペックって何？
>AquesTalk 新 SDK と FFI / Electron の調査スペック作成指示を出す

AquesTalkは新しいバージョンがあるけど、お金がかかるからまず現行版が動かす方向で。
動かない時は対応を考える。
> AquesTalk 新 SDK — 入手できるか、API・パス・サンプリングレートが現行と合うか

こちらは調査が必要か。
> FFI — ffi-napi の代わり（koffi など）で音声生成が呼べるか
> Electron — その FFI が動き、公証できる版はどれか

現行利用しているAquesTalkはApple Siliconに対応していない？
なら更新必要か。
今までどおりなら、開発では、AquesTalkのテスト版が出てると思うのでそれを利用しましょう。

https://github.com/taku-o/maquestalk1
https://github.com/taku-o/maquestalk1-ios
はこちらで開発しているライブラリ

secret
https://github.com/myukkurivoice/myukkurivoice-secret
もこちらで開発しているライブラリ。!

~/Desktopに
https://github.com/taku-o/maquestalk1
https://github.com/taku-o/maquestalk1-ios
https://github.com/myukkurivoice/myukkurivoice-secret
のレポジトリをcloneしておいた。
必要なら使ってください。

このあと、どのように作業を進めれば良い？
    調査
    設計が成立するかを先に確かめる。

    アクエストの評価版 SDK（AquesTalk1 / 2 / 10、AqKanji2Koe）を入手し、パス・API・サンプリングレートを見る
    Desktop の maquestalk1 / maquestalk1-ios を評価版で arm64 ビルドできるか
    myukkurivoice-secret を go build で arm64 にできるか（SDK とは独立なので、ここだけ先にできる）
    koffi 等で評価版の Synthe / FreeWave が呼べるか
    その FFI が動き、公証できる Electron の版
    スペック分割
    調査結果を見て、作業を複数スペックに分ける。1スペックずつ requirements → design → tasks → 実装。工程ごとに承認する。

    実装の順番
    vendor（評価版＋自作 CLI）→ FFI → electron.remote → Electron / Node → arm64 パッケージング → Playwright → CI → 独立ライブラリ

    最初に必要なのは、評価版 SDK の入手です。こちらでは公式サイトの利用規約同意やダウンロードは代行できません。入手できたら Desktop か vendor の場所を教えてください。






