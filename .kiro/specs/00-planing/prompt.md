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


~/Desktop/myukkurivoice-lib
にAquesTalkの評価版のライブラリをダウンロードして置きました。

AquesTalk1 iOS は
AquesTalk1 Mac がない時に回避的に利用していたライブラリなので、
新しい版では可能ならAquesTalk1 Macを利用したい。

.kiro/specs/00-planing/planning.md
のファイルに現在の計画を記録している。必要ならこのファイルを更新して。

talk2 の一部 phont（aq_defo1 / aq_momo1 / aq_teto1。現行アプリにはある）
は後から入れたものかも？
古い版に入っているものを、新しい版にコピーしたら、動くか確認して。

方針：
開発作業の前に、先に調査系の作業を行いたい。
とはいえ、全部作らなければ確認できないような大きすぎる調査は後回しにする。

その方針だと、今後、どのような作業を行うことになる？
それを出して貰って。
このタイミングでいったんcommit、pushしよう。


では、作業を再開しましょう。予定通り、次の調査のタスクを進めてください。
1. secret の arm64 go build
2. 評価版 dylib を koffi で最小呼び出し（AT1 / AT2 / AT10）
3. 現行 electron.remote の使用箇所の棚卸し（アップグレードはしない）
> この3つは、すでに実施済みです。

upcoming-work.mdの内容はNOWの箇所は古い？更新して。

AqKanji2Koe の Convert スニペットの調査を開始してください。


maquestalk1 は、AquesTalk1を呼び出すライブラリ。
これがあるのは、過去、直接ライブラリを実行できなかったから
作成されていた可能性がある。
新しい版では、AquesTalk2、AquesTalk10と同じように、直接ライブラリを実行できるようにできないかな？
調査して。

Cursorのスキルを追加した。
cc-sddという仕様駆動開発を管理するスキル。
このプロジェクトでは、このcc-sddベースで開発したい。

> /kiro-discovery "maquestalk1 と maquestalk1-ios を捨てて、AT1 を AT2 / AT10 と同じ koffi 直呼びにする"
コマンドを実行してください

nodeのバージョンは上げる想定で良い。
おそらく使用するElectronのバージョンが対応するnodeのバージョンにすることになる。

いくつか前提となる知識を登録する。
まず、cc-sddでの開発の進め方だが、

/kiro-spec-initを使うのでなく、

- /kiro-spec-requirements
- /kiro-validate-gap
- /kiro-spec-design
- /kiro-validate-design
- /kiro-spec-tasks
- 要件定義書・設計書・タスクリストの内容の確認
- /kiro-impl {feature} {task_number}
- /kiro-validate-impl {feature} {task_number}
- 実装内容のチェック、コードレビュー、コードの最適化
と細かく作業を切って、進めていく。

違った。

要件・設計・タスクのレビューは、
人間でなく、
/kiro-review-spec {feature}
を使う。これはClaude Code用に用意したコマンド。
Cursorでこれは利用可能？

> 今の Cursor では /kiro-review-spec は呼べません。 Claude Code 用の .claude/commands/kiro-review-spec.md にだけあります。.cursor/skills にも .cursor/commands にもありません。

実装確認・コードレビュー・最適化は、
/kiro-review-feature {feature} {task_number}
/code-review
を使用する。
これもClaude Code用に用意したコマンド。
Cursorでこれは利用可能？

> 両方とも、いまの Cursor プロジェクト設定では呼べません。 実行もコピーもしていません。
> 
> /kiro-review-feature — Claude Code の .claude/commands/kiro-review-feature.md にだけあります。.cursor 側にはありません。.cursor/skills/kiro-review は別物です。symlink 1本では、中で呼ぶ /simplify と /kiro-complete-tasks がまだ Claude Code 側だけなので、パイプラインは回りません。
> 
> /code-review — リポジトリに .claude/commands/code-review.md がありません。symlink 先がありません。Cursor 製品側には /agent-review や /review-bugbot があります。名前も用途も違います。このチャットに載ることがある /code-review は、汎用のコードレビュー指示で、Claude Code 用コマンドの複製ではありません。

では、実装の進め方だが、Cursor上で開発を進めると、
AIの使用量がまったく足りないのと、
コードレビュー用のスキルがClaude Code側ほど揃っていないので、
実際の実装はClaude Codeで行う想定でいきましょう。
Cursor側では、全体の開発の進捗の管理と、仕様の決定、
Claude Codeに渡す情報の作成などを行うことになる。

調査関連の作業はだいたい終わっているよね。
Claude Codeと情報を共有したいから、Cursor側で持っている情報、
特にCursor Projectのdocsに入っている資料を、
.kiro/specs/00-planing/
に書き出して欲しい。

git stagingにあがっているファイルをcommit、pushしてください。

この作業をするには、まずmyukkurivoice-vendorの更新が必要じゃない？
> 1. maquestalk1 / maquestalk1-ios を捨てて、AT1 を AT2 / AT10 と同じ koffi 直呼びに載せる（CLI は書き直さない）

なので、
2. myukkurivoice-vendor（評価版 SDK、AT1 の声種 dylib、secret、talk2 の追加 3 phont。maquestalk1 バイナリは入れない）
1. maquestalk1 / maquestalk1-ios を捨てて、AT1 を AT2 / AT10 と同じ koffi 直呼びに載せる（CLI は書き直さない）
の順で作業をしなければいけないのでは？


この作業がよくわからない。
2はコードを変更して、
3はライブラリを更新する作業？
> 2. maquestalk1 / maquestalk1-ios を捨てて、AT1 を AT2 / AT10 と同じ koffi 直呼びに載せる（CLI は書き直さない）
> 3. FFI を koffi に置き換え（アプリ側。talk1 も含む）

文章の前後で矛盾が生じている箇所があると思う。

例えば、upcoming-work.mdの"やらないこと（この段階）"
> maquestalk1 / アプリの書き換え（実装は工程 7。Claude Code。taku-o が {task_number} を出すまで入らない。Cursor は始めない）

実装は工程 7とあるけど、
7は、"テスト（Playwright 化は許可が必要）"になってるじゃない？


