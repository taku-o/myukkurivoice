# MYukkuriVoice
MYukkuriVoiceは、AquesTalkを利用したMac OSX向けの  
動画制作向け合成音声生成アプリケーションです。  
macOSX El Capitan (10.11)、macOS X Sierra (10.12)、および、それ以降に対応しています。  
(macOS High Sierra(10.13)もおそらく動く？)

<img src="https://raw.github.com/taku-o/myukkurivoice/master/icns/myukkurivoice.iconset/icon_256x256.png">

本ソフトは、(株)アクエストの音声合成ライブラリAquesTalkを使用しており、その著作権は同社に帰属します。  
本ソフトを営利目的で使用する場合は当該ライブラリの使用ライセンスが必要となります。ご注意ください。  
[http://www.a-quest.com/](http://www.a-quest.com/)

* 関連: [Mac用ニコ生コメントビューワ + 読み上げ + コメジェネ、ワンパックアプリ Zosui](https://github.com/taku-o/zosui)

## 開発ステータス
* アプリ公開
* (NEW!! 2017/11/15) AquesTalk10の音声の再生に対応。
* (NEW!! 2017/11/21) 録音した音声ファイルを動画編集ソフトに直接ドラッグアンドドロップできるように。
* (NEW!! 2017/11/28) 個人で非営利用途以外で使う人向けに、AquesTalk10の使用ライセンスキーを環境設定で設定できるようになりました。
* (NEW!! 2018/01/12) AquesTalk10の音声設定調節機能を追加しました。AquesTalk10ベースの声を選んだ時のみ、アクセント、音程などの音声の調節を行えます。
* 内部構造を大きく変更したので、
  * アプリをバージョンアップする前は、大事な設定はメモを取っておいてください。
  * 動作がおかしい場合はメニューから設定の初期化を実施するか、過去のバージョンを利用してください。

## ダウンロード
* [https://github.com/taku-o/myukkurivoice/releases](https://github.com/taku-o/myukkurivoice/releases)

## インストール
[https://github.com/taku-o/myukkurivoice/releases](https://github.com/taku-o/myukkurivoice/releases) から圧縮ファイル(MYukkuriVoice-darwin-x64.zip)を  
ダウンロードして解凍後、  
初回の起動は MYukkuriVoice.app を右クリックして「開く」を選択してください。

## アプリケーションヘルプ
* [https://taku-o.github.io/myukkurivoice/help](https://taku-o.github.io/myukkurivoice/help)

## リリースノート
* [https://taku-o.github.io/myukkurivoice/releases](https://taku-o.github.io/myukkurivoice/releases)

## 主な特徴
### 基本
* MacOSX Sierra以降で動作検証。
* 設定を用意して切り替えて作業するスタイルで利用します。

<img class="border" src="https://raw.github.com/taku-o/myukkurivoice/master/docs/images/readme.gif" width="400">

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

<img class="border" src="https://raw.github.com/taku-o/myukkurivoice/master/docs/images/readme-dnd.gif" width="400">

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
* 各種ショートカットキー
* チュートリアル、ヘルプ

## 動画
[![](http://img.youtube.com/vi/DUbXHZrW1Ms/0.jpg)](https://www.youtube.com/watch?v=DUbXHZrW1Ms)

[![](http://img.youtube.com/vi/povuqyEl6L4/0.jpg)](https://www.youtube.com/watch?v=povuqyEl6L4)

[![](http://img.youtube.com/vi/iv2GgKt7mJU/0.jpg)](https://www.youtube.com/watch?v=iv2GgKt7mJU)


