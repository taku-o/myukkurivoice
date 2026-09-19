次に進めるべき作業は
> THEN 1. ファイル。 myukkurivoice-vendor（評価版 SDK、AT1 の声種 dylib、secret の arm64、talk2 の追加 3 phont。maquestalk1 / maquestalk1-ios のバイナリは入れない）
で良い？

では、Claude Codeとの連携する準備を開始する。
myukkurivoiceに .kiro/specs/01-vendor-updates/ ディレクトリを作成。
myukkurivoiceで、feature/applecpu/masterブランチから、作業用ブランチ feature/applecpu/vender-updates を作成する。
myukkurivoice-vendorは feature/applecpu/masterブランチを作成。

このプロジェクトは複数レポジトリが絡んでいるプロジェクトとなるが、あちこちに作業ファイルが散ると面倒なので、
作業の記録ファイルは myukkurivoice に置く。

myukkurivoiceの .kiro/specs/01-vendor-updates/ ディレクトリに、Claude Codeに渡す情報の資料を作成してください。
タスクの作業の内容や、タスクを実現する上で知っておくべき情報。
この資料の内容は .kiro/specs/00-planing/以下の資料は読んでいる前提で良い。

git stagingに上がっている修正をcommitして。
git push origin HEAD
myukkurivoiceのoriginのfeature/applecpu/masterに向けたpull requestを作成してください。

Claude Codeにはどのような作業指示のメッセージを渡せば良いかな？

spec名は01-vendor-updatesです。

THEN 1 の vendor ファイル投入をやってください。

先に次を読んでから動いてください。00-planing は読んだ前提で、再掲しないでください。

/Users/taku-o/Desktop/myukkurivoice/.kiro/specs/01-vendor-updates/README.md
/Users/taku-o/Desktop/myukkurivoice/.kiro/specs/01-vendor-updates/claude-handoff.md
/Users/taku-o/Desktop/myukkurivoice/.kiro/specs/01-vendor-updates/sources.md
作業先: /Users/taku-o/Desktop/myukkurivoice-vendor のブランチ feature/applecpu/master 読み元: /Users/taku-o/Desktop/myukkurivoice-lib（git に入れない）

置くもの:

評価版 SDK（Mac 4 本）。現行どおり二層（aqtk*-mac / aqk2k_mac と、アプリが読むルート）。評価版のファイル名は変えない
AT1 声種 dylib 9 本（lib/libAquesTalk1-XX.dylib）
secret の arm64（secret.go からビルド。checkout の x86_64 はコピーしない）
talk2 追加 3 phont（aq_defo1 / aq_momo1 / aq_teto1）。公式 14 種を評価版で置き換えるとき落とさない
やらないこと:

本体アプリ（js/、gulp、テスト）の書き換え
maquestalk1 の書き直し。CLI バイナリを vendor に入れること
iOS SDK、評価版 DMG、作業用 store、myukkurivoice git ツリーへの SDK 直置き
commit / push（私が言うまで）
本体の submodule SHA 追従
「完了」と書かない
作業メモは .kiro/specs/01-vendor-updates/ だけに書いてください。

確認してから進めてください（自己判断で消さない）:

ルートの古い .framework / i386・x86_64 バイナリを残すか消すか
現行 aq_dic_large/aq_user.csv を残すか
投入後は claude-handoff.md の確認の目安（arch、AT1 のファイル名、secret が arm64、phont が 14+3、本体 git に .dylib が増えていないこと）を報告してください。アプリ起動は範囲外です。


要件定義書の作成作業を行っていない。何故実装作業をしている？

誤りが発見された。
>  .kiro/specs/00-planing/cc-sdd-adoption.md に、このプロジェクトの役割分担が明記されています。
>  ▎ Cursor: 進捗管理・仕様の決定（/kiro-spec-requirements … /kiro-spec-tasks）
>  ▎ Claude Code: /kiro-review-spec。製品の実装・検証・実装レビュー（/kiro-impl 以降）
進捗管理・仕様の決定はCursorで行うが、
/kiro-spec-requirementsコマンドを実行して、要件定義書を作成するのはClaude Codeとなる。

/kiro-validate-gap / /kiro-spec-design / /kiro-validate-design / /kiro-spec-tasks もClaude Codeが担当。


作業の進め方まわり、
/kiro-spec-requirementsコマンドをCursorが実行する前提でドキュメントが書かれているのではないか？直して。


これは誤り。ドキュメントを修正させている。
>  .kiro/specs/00-planing/cc-sdd-adoption.md に、このプロジェクトの役割分担が明記されています。
>  ▎ Cursor: 進捗管理・仕様の決定（/kiro-spec-requirements … /kiro-spec-tasks）
>  ▎ Claude Code: /kiro-review-spec。製品の実装・検証・実装レビュー（/kiro-impl 以降）
仕切り直す。
やってしまった実装は取り消して。
要件定義書の段階で、実装変更が残っているとCritical bugとして報告される。

これは何？決められた作業手順を変えようとしている？

ファイルとして書き出した資料に余計な記載がないか確認。
資料全体を通して確認して矛盾がないか確認。
その後、専門家の視点で、調査資料、設計の計画を確認。

git commit, git pushしてください。

これは開発中はコメントアウト＋コメントを残して置くことで対応しよう。
> 評価版を vendor に置くことと、配布物に載せないゲートは別。AT2 評価版は *Eva* で SetDevKey が無い

これは今もそうだね？
GitHub issueにこの問題を登録してくれる？
> AT10 は 16kHz、アプリ再生は 8kHz 前提

これは何？
> 辞書 3 種が不一致。aq_user.csv は未決

aq_dic_largeを使います。確かaq_dicをaq_dic_largeに差し替えた記憶があります。
> 現行アプリが読む aq_dic_large

少し作業を進めて分かったが、
myukkurivoice-vendorの作業を進めるには、secretを更新する必要があるんだ。
作業手順として、myukkurivoice-vendorの前にmyukkurivoice-secretを更新する作業を差し込もう。
> THEN 1. ファイル。 myukkurivoice-vendor（評価版 SDK、AT1 の声種 dylib、secret の arm64、talk2 の追加 3 phont。maquestalk1 / maquestalk1-ios のバイナリは入れない）

myukkurivoice-secret ももう feature/applecpu/masterブランチを作成してください。

.kiro/specs/01-secret-updatesディレクトリに、
Claude Codeへの作業指示用の資料を作成してください。

もう一度言いますね。非常に重要な内容です。
おそらくまったく出来ていません。仕事を任せたAgentが出来ていないのに
出来たと言い張っている可能性があります。

**Claude Codeは/kiro-コマンドを使うんだよ。**

Cursor Projectがエージェントに仕事を任せたあと、
その仕事の結果がうまく出来ているかをチェックする仕組みが入っていないようです。
品質を担保する上で非常に重要です。
ルールを追加してください。
一つの作業を指示する際、作業を行うエージェントと、それとは別に作業の結果をレビューするエージェントを用意するのです。
出来ていない場合はやり直させたり、修正したり、品質を改善したりする必要があります。
