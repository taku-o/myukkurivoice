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

