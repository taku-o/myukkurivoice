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
requirments.md、design.md、tasks.md、prompt.mdというファイル名のファイルは作ってはいけない。それらのファイル名は実装側が使う。

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
/kiro-*。requirements.md / design.md / tasks.md / prompt.md / spec.json を新規作成
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
>  さらに、THEN 1（vendorファイル投入）自体は 01-vendor-updates/README.md
>  に「このフォルダはcc-sddのspecではない」「feature名はtaku-oが/kiro-spec-requirementsを出すまで決めな
>  い」と明記されており、前回私が行ったvendorファイル投入作業は、THEN 1向けの正しい対応だったことも分か
>  りました（specを作らずhandoffドキュメント通りに実装、という扱いが元々想定されていた）。


これは誤り。ドキュメントを修正させている。
>  .kiro/specs/00-planing/cc-sdd-adoption.md に、このプロジェクトの役割分担が明記されています。
>  ▎ Cursor: 進捗管理・仕様の決定（/kiro-spec-requirements … /kiro-spec-tasks）
>  ▎ Claude Code: /kiro-review-spec。製品の実装・検証・実装レビュー（/kiro-impl 以降）
仕切り直す。
やってしまった実装は取り消して。
要件定義書の段階で、実装変更が残っているとCritical bugとして報告される。

これは何？決められた作業手順を変えようとしている？
> THEN 1 は spec ではなく handoff どおり、という扱いは変えません。

.kiro/specs/01-vendor-updates/README.md に
Cursor向けの記述が書いてある。
しかし、これをClaude Codeが読むと、requirements.mdなどを作るな、
という指示になってしまい、Claude Codeを混乱させている。

資料の見直しをしてください。
.kiro/specs以下に置くファイルは、Cursorだけの資料ではない。
Cursorだけに対する内容があったら、それは載せてはいけない。
そういう指示の資料は、Cursor Project内に置いておこう。

ファイルとして書き出した資料に余計な記載がないか確認。
資料全体を通して確認して矛盾がないか確認。
その後、専門家の視点で、調査資料、設計の計画を確認。


