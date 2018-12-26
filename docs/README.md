# MYukkuriVoice
[MYukkuriVoice](https://taku-o.github.io/myukkurivoice/)は、AquesTalkを利用したMac OSX向けの  
動画制作向けに調整された合成音声生成アプリケーションです。  
入力した日本語メッセージから音声ファイルを作成できます。  
macOSX El Capitan (10.11)、macOS X Sierra (10.12)、および、
macOS High Sierra(10.13)に対応しています。  

<img src="https://raw.githubusercontent.com/taku-o/myukkurivoice/master/icns/myukkurivoice.iconset/icon_256x256.png" class="noborder">

本ソフトは、(株)アクエストの音声合成ライブラリAquesTalkを使用しており、その著作権は同社に帰属します。  
本ソフトを営利目的で使用する場合は当該ライブラリの使用ライセンスが必要となります。ご注意ください。  
[http://www.a-quest.com/](http://www.a-quest.com/)

## 目次

<!-- toc -->

- [開発ステータス](#%E9%96%8B%E7%99%BA%E3%82%B9%E3%83%86%E3%83%BC%E3%82%BF%E3%82%B9)
- [アプリバージョン](#%E3%82%A2%E3%83%97%E3%83%AA%E3%83%90%E3%83%BC%E3%82%B8%E3%83%A7%E3%83%B3)
- [MYukkuriVoiceの導入](#myukkurivoice%E3%81%AE%E5%B0%8E%E5%85%A5)
  * [ダウンロード](#%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89)
  * [インストール](#%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB)
  * [アンインストール](#%E3%82%A2%E3%83%B3%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB)
- [MYukkuriVoiceに関して](#myukkurivoice%E3%81%AB%E9%96%A2%E3%81%97%E3%81%A6)
  * [アプリの使い方を学ぶにはまず何から始めれば良いか](#%E3%82%A2%E3%83%97%E3%83%AA%E3%81%AE%E4%BD%BF%E3%81%84%E6%96%B9%E3%82%92%E5%AD%A6%E3%81%B6%E3%81%AB%E3%81%AF%E3%81%BE%E3%81%9A%E4%BD%95%E3%81%8B%E3%82%89%E5%A7%8B%E3%82%81%E3%82%8C%E3%81%B0%E8%89%AF%E3%81%84%E3%81%8B)
  * [取り扱い種別・使用ライセンス](#%E5%8F%96%E3%82%8A%E6%89%B1%E3%81%84%E7%A8%AE%E5%88%A5%E3%83%BB%E4%BD%BF%E7%94%A8%E3%83%A9%E3%82%A4%E3%82%BB%E3%83%B3%E3%82%B9)
  * [ヘルプ・マニュアル](#%E3%83%98%E3%83%AB%E3%83%97%E3%83%BB%E3%83%9E%E3%83%8B%E3%83%A5%E3%82%A2%E3%83%AB)
  * [リリースノート](#%E3%83%AA%E3%83%AA%E3%83%BC%E3%82%B9%E3%83%8E%E3%83%BC%E3%83%88)
  * [連絡先・問題の報告](#%E9%80%A3%E7%B5%A1%E5%85%88%E3%83%BB%E5%95%8F%E9%A1%8C%E3%81%AE%E5%A0%B1%E5%91%8A)
- [MYukkuriVoiceの主な特徴](#myukkurivoice%E3%81%AE%E4%B8%BB%E3%81%AA%E7%89%B9%E5%BE%B4)
  * [基本](#%E5%9F%BA%E6%9C%AC)
  * [ショートカット](#%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%82%AB%E3%83%83%E3%83%88)
  * [ファイルの出力オプション](#%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%81%AE%E5%87%BA%E5%8A%9B%E3%82%AA%E3%83%97%E3%82%B7%E3%83%A7%E3%83%B3)
  * [選択した範囲のテキストのみの音声再生・録音](#%E9%81%B8%E6%8A%9E%E3%81%97%E3%81%9F%E7%AF%84%E5%9B%B2%E3%81%AE%E3%83%86%E3%82%AD%E3%82%B9%E3%83%88%E3%81%AE%E3%81%BF%E3%81%AE%E9%9F%B3%E5%A3%B0%E5%86%8D%E7%94%9F%E3%83%BB%E9%8C%B2%E9%9F%B3)
  * [保存した音声ファイルをアプリから動画編集ソフトに直接ドラッグアンドドロップ](#%E4%BF%9D%E5%AD%98%E3%81%97%E3%81%9F%E9%9F%B3%E5%A3%B0%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%82%92%E3%82%A2%E3%83%97%E3%83%AA%E3%81%8B%E3%82%89%E5%8B%95%E7%94%BB%E7%B7%A8%E9%9B%86%E3%82%BD%E3%83%95%E3%83%88%E3%81%AB%E7%9B%B4%E6%8E%A5%E3%83%89%E3%83%A9%E3%83%83%E3%82%B0%E3%82%A2%E3%83%B3%E3%83%89%E3%83%89%E3%83%AD%E3%83%83%E3%83%97)
  * [ユーザー辞書機能](#%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E8%BE%9E%E6%9B%B8%E6%A9%9F%E8%83%BD)
  * [最近録音したファイルの一覧と入力の復元](#%E6%9C%80%E8%BF%91%E9%8C%B2%E9%9F%B3%E3%81%97%E3%81%9F%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%81%AE%E4%B8%80%E8%A6%A7%E3%81%A8%E5%85%A5%E5%8A%9B%E3%81%AE%E5%BE%A9%E5%85%83)
  * [その他](#%E3%81%9D%E3%81%AE%E4%BB%96)
  * [機能一覧](#%E6%A9%9F%E8%83%BD%E4%B8%80%E8%A6%A7)
- [動画リンク](#%E5%8B%95%E7%94%BB%E3%83%AA%E3%83%B3%E3%82%AF)

<!-- tocstop -->

<a name="開発ステータス"></a>
## 開発ステータス
* アプリ公開
* (2017/11/15) AquesTalk10の音声の再生に対応。
* (2017/11/21) 録音した音声ファイルを動画編集ソフトに直接ドラッグアンドドロップできるように。
* (2017/11/28) 個人で非営利用途以外で使う人向けに、AquesTalk10の使用ライセンスキーを環境設定で設定できるようになりました。
* (2018/01/12) AquesTalk10の音声設定調節機能を追加しました。AquesTalk10ベースの声を選んだ時のみ、アクセント、音程などの音声の調節を行えます。
* (2018/08/26) ボイスロイドにあるマルチボイス機能を追加。
  * "声種プリセット＞会話"と入力して、複数メッセージをまとめて音声再生、音声録音する機能です。
  * [マルチボイスヘルプ](https://taku-o.github.io/myukkurivoice/help#!#multivoice)
* 内部構造を大きく変更したので、
  * アプリをバージョンアップする前は、大事な設定はメモを取っておいてください。
  * 動作がおかしい場合はメニューから設定の初期化を実施するか、過去のバージョンを利用してください。
* (NEW!! 2018/11/10) ユーザー辞書機能を追加。
* (NEW!! 2018/11/28) 録音処理が劇的に高速化。超早くなった。

<a name="アプリバージョン"></a>
## アプリバージョン

| バージョン | ステータス     | リンク                                                     |
| ---------- | -------------- | ---------------------------------------------------------- |
| 0.9.*      | 開発版         | https://github.com/taku-o/myukkurivoice/releases/latest    |
| 0.8.*      | テスト済・安定 | https://github.com/taku-o/myukkurivoice/releases/tag/0.8.1 |

<a name="myukkurivoiceの導入"></a>
## MYukkuriVoiceの導入
<a name="ダウンロード"></a>
### ダウンロード
* 最新のアプリは次のURLからダウンロードできます。
  * [https://github.com/taku-o/myukkurivoice/releases](https://github.com/taku-o/myukkurivoice/releases)
    * [※Chromeで「一般的にダウンロードされておらず、危険を及ぼす可能性があります」と表示される](https://taku-o.github.io/myukkurivoice/help#!#trouble)。そのままダウンロードを進めてください。

<a name="インストール"></a>
### インストール
圧縮ファイル(MYukkuriVoice-darwin-x64.zip)をダウンロードして解凍後、  
初回の起動は MYukkuriVoice.app を右クリックして「開く」を選択してください。

<a name="アンインストール"></a>
### アンインストール
* アプリケーションをアンインストールするには、次のファイル・フォルダを削除してください。
  * アプリケーション MYukkuriVoice.app
  * ~/Application Support/MYukkuriVoice フォルダ
  * ~/Library/Logs/MYukkuriVoice フォルダ

<a name="myukkurivoiceに関して"></a>
## MYukkuriVoiceに関して
<a name="アプリの使い方を学ぶにはまず何から始めれば良いか"></a>
### アプリの使い方を学ぶにはまず何から始めれば良いか
1. MYukkuriVoiceを起動すると、右上に「チュートリアル」ボタンがあるので、それを押してチュートリアルを読んでみましょう。
2. メッセージ入力欄に文字を入力、「▶再生」ボタンを押して、音声を再生してみましょう。
3. メッセージ入力欄に文字を入力、「●記録」ボタンを押して、音声を録音してみましょう。
4. 声の種類を切り替えて、音声を再生、記録してみましょう。

<a name="取り扱い種別・使用ライセンス"></a>
### 取り扱い種別・使用ライセンス
本ソフトは、(株)アクエストの音声合成ライブラリAquesTalkを使用しており、その著作権は同社に帰属します。  
* [http://www.a-quest.com/](http://www.a-quest.com/)

本ソフトは個人の動画作成で使うなど、非営利目的で扱う場合には無償で扱えますが、  
例えば、企業での利用であったり、広告をつけた動画で利用するなど収益が発生する場合には、  
営利目的での利用となり、当該ライブラリの使用ライセンスが必要となります。  

どのようなケースが営利目的に該当するか、どのようにして使用ライセンスを入手すれば良いか、については、  
こちらのページにまとめてありますのでご確認ください。
* [AquesTalkのライセンスについて](https://taku-o.github.io/myukkurivoice/help#!#license)

<a name="ヘルプ・マニュアル"></a>
### ヘルプ・マニュアル
* MYukkuriVoiceのヘルプです。
  * [https://taku-o.github.io/myukkurivoice/help](https://taku-o.github.io/myukkurivoice/help)
  * アプリ内にある「ヘルプ」ボタンでも同じ内容をご覧になれます。

<a name="リリースノート"></a>
### リリースノート
* 各バージョンごとの変更点
  * [https://taku-o.github.io/myukkurivoice/releases](https://taku-o.github.io/myukkurivoice/releases)

<a name="連絡先・問題の報告"></a>
### 連絡先・問題の報告
* MYukkuriVoiceは、次のURLで開発しています。
  * [https://github.com/taku-o/myukkurivoice](https://github.com/taku-o/myukkurivoice)
* バグ報告は[こちら(課題リスト)](https://github.com/taku-o/myukkurivoice/issues)に登録お願いいたします。
* 連絡する際はこちら(mail@nanasi.jp)までお願いします。

<a name="myukkurivoiceの主な特徴"></a>
## MYukkuriVoiceの主な特徴
<a name="基本"></a>
### 基本
* MacOSX Sierra以降で動作検証。
* 設定を用意して切り替えて作業するスタイルで利用します。

<a href="https://raw.githubusercontent.com/taku-o/myukkurivoice/master/docs/images/readme.gif"><img class="border" src="https://raw.githubusercontent.com/taku-o/myukkurivoice/master/docs/images/readme.gif" width="400"></a>

<a name="ショートカット"></a>
### ショートカット
* 動画制作向きのショートカットキーがいくつか定義されています

<img class="border" src="https://raw.githubusercontent.com/taku-o/myukkurivoice/master/docs/images/readme-shortcut-play.png" width="400">

<a name="ファイルの出力オプション"></a>
### ファイルの出力オプション
1ファイルごとにファイル名を指定して保存する方法以外に、  
音声ファイルを連番付きのファイル名で保存したり、  
音声ファイルの元となったメッセージを保存する機能があります。

<img class="border" src="https://raw.githubusercontent.com/taku-o/myukkurivoice/master/docs/images/readme-filewriteopt.png" width="400">

<a name="選択した範囲のテキストのみの音声再生・録音"></a>
### 選択した範囲のテキストのみの音声再生・録音
* 選択した範囲のテキストを再生、録音する機能があります。
* メッセージ入力欄、音記号列入力欄、どちらでも機能します。

<img class="border" src="https://raw.githubusercontent.com/taku-o/myukkurivoice/master/docs/images/readme-select-encoded.png" width="400">

<a name="保存した音声ファイルをアプリから動画編集ソフトに直接ドラッグアンドドロップ"></a>
### 保存した音声ファイルをアプリから動画編集ソフトに直接ドラッグアンドドロップ
* 最後に保存した音声ファイルのリンクが、アプリの左下に表示されます。
* ドラッグアンドドロップで動画編集ソフトに渡せます。

<a href="https://raw.githubusercontent.com/taku-o/myukkurivoice/master/docs/images/readme-dnd.gif"><img class="border" src="https://raw.githubusercontent.com/taku-o/myukkurivoice/master/docs/images/readme-dnd.gif" width="400"></a>

<a name="ユーザー辞書機能"></a>
### ユーザー辞書機能
* ユーザー辞書の機能があります。
* 設定すると、指定の語が来た時に、指定の読み方をするようになります。
* またメッセージを音声記号列に変換する際、この辞書の定義が使われます。

<img class="border" src="https://raw.githubusercontent.com/taku-o/myukkurivoice/master/docs/images/readme-aqdicedit.png" width="400">

<a name="最近録音したファイルの一覧と入力の復元"></a>
### 最近録音したファイルの一覧と入力の復元
* 録音したファイルの一覧を記録しています。
* 一覧には、アプリの下部と、Dockのアプリアイコンからアクセスします。

<img class="border" src="https://raw.githubusercontent.com/taku-o/myukkurivoice/master/docs/images/readme-app-recent-line.png" width="400">

* 一覧から選択すると、音声を録音した当時の入力情報を、アプリの入力欄に復元できます。

<img class="border" src="https://raw.githubusercontent.com/taku-o/myukkurivoice/master/docs/images/readme-app-recent-edit.png" width="400">

<a name="その他"></a>
### その他
* チュートリアル、ヘルプが用意されています

<img src="https://raw.githubusercontent.com/taku-o/myukkurivoice/master/docs/images/readme-tutorial.png" width="400">

* AquesTalk10から導入された音声の調節機能にも対応しています。(AquesTalk10ベースの音声のみ)

<img class="border" src="https://raw.githubusercontent.com/taku-o/myukkurivoice/master/docs/images/readme-editaq10voice.png" width="400">

<a name="機能一覧"></a>
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
* テキストファイルをドロップしての入力。テキストフィールド、および、アプリアイコンが対応。
* 保存メッセージをクリックして、音声ファイル、メッセージファイルをQuickLookで開く。
* ユーザー辞書機能
* 最近録音したファイルの一覧。選択すると録音時の入力メッセージ、音声記号列を復元します。
* 各種ショートカットキー
* チュートリアル、ヘルプ

<a name="動画リンク"></a>
## 動画リンク
<a href="http://www.nicovideo.jp/watch/sm30435205"><img class="border" src="https://raw.githubusercontent.com/taku-o/myukkurivoice/master/docs/images/sm30435205.png" width="400"></a>

<a href="http://www.nicovideo.jp/watch/sm30826557"><img class="border" src="https://raw.githubusercontent.com/taku-o/myukkurivoice/master/docs/images/sm30826557.png" width="400"></a>

<a href="http://www.nicovideo.jp/watch/sm32273442"><img class="border" src="https://raw.githubusercontent.com/taku-o/myukkurivoice/master/docs/images/sm32273442.png" width="400"></a>

<a href="http://www.nicovideo.jp/watch/sm34217643"><img class="border" src="https://raw.githubusercontent.com/taku-o/myukkurivoice/master/docs/images/sm34217643.png" width="400"></a>


