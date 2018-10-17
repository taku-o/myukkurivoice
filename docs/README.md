# MYukkuriVoice
[MYukkuriVoice](https://taku-o.github.io/myukkurivoice/)は、AquesTalkを利用したMac OSX向けの  
動画制作向けに調整された合成音声生成アプリケーションです。  
入力した日本語メッセージから音声ファイルを作成できます。  
macOSX El Capitan (10.11)、macOS X Sierra (10.12)、および、
macOS High Sierra(10.13)に対応しています。  

<img src="https://raw.github.com/taku-o/myukkurivoice/master/icns/myukkurivoice.iconset/icon_256x256.png" class="noborder">

本ソフトは、(株)アクエストの音声合成ライブラリAquesTalkを使用しており、その著作権は同社に帰属します。  
本ソフトを営利目的で使用する場合は当該ライブラリの使用ライセンスが必要となります。ご注意ください。  
[http://www.a-quest.com/](http://www.a-quest.com/)

## 開発ステータス
* アプリ公開
* (NEW!! 2017/11/15) AquesTalk10の音声の再生に対応。
* (NEW!! 2017/11/21) 録音した音声ファイルを動画編集ソフトに直接ドラッグアンドドロップできるように。
* (NEW!! 2017/11/28) 個人で非営利用途以外で使う人向けに、AquesTalk10の使用ライセンスキーを環境設定で設定できるようになりました。
* (NEW!! 2018/01/12) AquesTalk10の音声設定調節機能を追加しました。AquesTalk10ベースの声を選んだ時のみ、アクセント、音程などの音声の調節を行えます。
* (NEW!! 2018/08/26) ボイスロイドにあるマルチボイス機能を追加。
  * "声種プリセット＞会話"と入力して、複数メッセージをまとめて音声再生、音声録音する機能です。
  * [マルチボイスヘルプ](https://taku-o.github.io/myukkurivoice/help#!#multivoice)
* 内部構造を大きく変更したので、
  * アプリをバージョンアップする前は、大事な設定はメモを取っておいてください。
  * 動作がおかしい場合はメニューから設定の初期化を実施するか、過去のバージョンを利用してください。

## MYukkuriVoiceの導入
### ダウンロード
* 最新のアプリは次のURLからダウンロードできます。
* [https://github.com/taku-o/myukkurivoice/releases](https://github.com/taku-o/myukkurivoice/releases)
  * [※Chromeで「一般的にダウンロードされておらず、危険を及ぼす可能性があります」と表示される](https://taku-o.github.io/myukkurivoice/help#!#trouble)。そのままダウンロードを進めてください。

### インストール
圧縮ファイル(MYukkuriVoice-darwin-x64.zip)を  
ダウンロードして解凍後、  
初回の起動は MYukkuriVoice.app を右クリックして「開く」を選択してください。

### アンインストール
* アプリケーションをアンインストールするには、次のファイル・フォルダを削除してください。
  * アプリケーション MYukkuriVoice.app
  * ~/Application Support/MYukkuriVoice フォルダ
  * ~/Library/Logs/MYukkuriVoice フォルダ

## MYukkuriVoiceに関して
### アプリの使い方を学ぶには、まず何から始めれば良いか？
* MYukkuriVoiceを起動すると、右上に「チュートリアル」ボタンがあるので、それを押してチュートリアルを読んでみましょう。
* メッセージ入力欄に文字を入力、「▶再生」ボタンを押して、音声を再生してみましょう。
* メッセージ入力欄に文字を入力、「●記録」ボタンを押して、音声を録音してみましょう。
* 声の種類を切り替えて、音声を再生、記録してみましょう。

### 取り扱い種別・使用ライセンス
本ソフトは、(株)アクエストの音声合成ライブラリAquesTalkを使用しており、その著作権は同社に帰属します。  
[http://www.a-quest.com/](http://www.a-quest.com/)

本ソフトは個人の動画作成で使うなど、非営利目的で扱う場合には無償で扱えますが、  
例えば、企業での利用であったり、広告をつけた動画で利用するなど収益が発生する場合には、  
営利目的での利用となり、当該ライブラリの使用ライセンスが必要となります。  

どのようなケースが営利目的に該当するか、  
どのようにして使用ライセンスを入手すれば良いか、については、  
こちらのページにまとめてありますのでご覧ください。  
[AquesTalkのライセンスについて](https://taku-o.github.io/myukkurivoice/help#!#license)

### ヘルプ・マニュアル
* [https://taku-o.github.io/myukkurivoice/help](https://taku-o.github.io/myukkurivoice/help)
  * アプリ内にある「ヘルプ」ボタンでも同じ内容をご覧になれます。

### リリースノート
* 各バージョンごとの変更点
  * [https://taku-o.github.io/myukkurivoice/releases](https://taku-o.github.io/myukkurivoice/releases)

### 連絡先・問題の報告
* MYukkuriVoiceは、次のURLで開発しています。
  * [https://github.com/taku-o/myukkurivoice](https://github.com/taku-o/myukkurivoice)
* バグ報告は[こちら(課題リスト)](https://github.com/taku-o/myukkurivoice/issues)に登録お願いいたします。
* 連絡する際はこちら(mail@nanasi.jp)までお願いします。

## MYukkuriVoiceの主な特徴
### 基本
* MacOSX Sierra以降で動作検証。
* 設定を用意して切り替えて作業するスタイルで利用します。

<a href="https://raw.github.com/taku-o/myukkurivoice/master/docs/images/readme.gif"><img class="border" src="https://raw.github.com/taku-o/myukkurivoice/master/docs/images/readme.gif" width="400"></a>

### ショートカット
* 動画制作向きのショートカットキーがいくつか定義されています

<img class="border" src="https://raw.github.com/taku-o/myukkurivoice/master/docs/images/readme-shortcut-play.png" width="400">

### ファイルの出力オプション
1ファイルごとにファイル名を指定して保存する方法以外に、  
音声ファイルを連番付きのファイル名で保存したり、  
音声ファイルの元となったメッセージを保存する機能があります。

<img class="border" src="https://raw.github.com/taku-o/myukkurivoice/master/docs/images/readme-filewriteopt.png" width="400">

### 選択した範囲のテキストのみの音声再生・録音
* 選択した範囲のテキストを再生、録音する機能があります。
* メッセージ入力欄、音記号列入力欄、どちらでも機能します。

<img class="border" src="https://raw.github.com/taku-o/myukkurivoice/master/docs/images/readme-select-encoded.png" width="400">

### 保存した音声ファイルをアプリから動画編集ソフトに直接ドラッグアンドドロップ
* 最後に保存した音声ファイルのリンクが、アプリの左下に表示されます。
* ドラッグアンドドロップで動画編集ソフトに渡せます。

<a href="https://raw.github.com/taku-o/myukkurivoice/master/docs/images/readme-dnd.gif"><img class="border" src="https://raw.github.com/taku-o/myukkurivoice/master/docs/images/readme-dnd.gif" width="400"></a>

### その他
* チュートリアル、ヘルプが用意されています

<img src="https://raw.github.com/taku-o/myukkurivoice/master/docs/images/readme-tutorial.png" width="400">

* AquesTalk10から導入された音声の調節機能にも対応しています。(AquesTalk10ベースの音声のみ)

<img class="border" src="https://raw.github.com/taku-o/myukkurivoice/master/docs/images/readme-editaq10voice.png" width="400">

### 機能一覧
* AquesTalk1, AquesTalk2, AquesTalk10ベースのメッセージ音声再生、音声録音機能
* 音記号列の表示編集、および、変更後音記号列の音声再生機能
* テキストエリアで選択したテキスト部分のみを音声再生、音声録音
* 設定の保存、複製。設定に名前をつけて複数の設定を保存可能。
* ファイル名を指定しての音声ファイル保存。連番ファイルでの音声ファイル保存の選択可能
* 音声保存時に、音声の元となったメッセージもテキストファイルに保存
* 音量、再生速度の調整。音質の調整。
* 再生する音声の抑揚のON・OFF切替
* 音声の再生時間目安の表示
* アプリから動画編集ソフトに、音声ファイルを直接ドラッグアンドドロップできる機能
* ウィンドウの前面表示固定、切替機能
* アプリを閉じた時のウィンドウの位置を記憶する
* マルチボイス機能
* テキストファイルをドロップしての入力
* 各種ショートカットキー
* チュートリアル、ヘルプ

## 動画リンク
<a href="http://www.nicovideo.jp/watch/sm30435205"><img class="border" src="https://raw.github.com/taku-o/myukkurivoice/master/docs/images/sm30435205.png" width="400"></a>

<a href="http://www.nicovideo.jp/watch/sm30826557"><img class="border" src="https://raw.github.com/taku-o/myukkurivoice/master/docs/images/sm30826557.png" width="400"></a>

<a href="http://www.nicovideo.jp/watch/sm32273442"><img class="border" src="https://raw.github.com/taku-o/myukkurivoice/master/docs/images/sm32273442.png" width="400"></a>


