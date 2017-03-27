# MYukkuriVoice
MYukkuriVoiceは、AquesTalkを利用したMac OSX向けの  
動画制作向け合成音声生成アプリケーションです。  
macOSX El Capitan (10.11)、macOS X Sierra (10.12)、および、それ以降に対応しています。

<img src="https://github.com/taku-o/myukkurivoice/blob/master/icns/myukkurivoice.iconset/icon_256x256.png">

本ソフトは、(株)アクエストの音声合成ライブラリAquesTalkを使用しており、その著作権は同社に帰属します。  
本ソフトを営利目的で使用する場合は当該ライブラリの使用ライセンスが必要となります。ご注意ください。  
http://www.a-quest.com/

## 開発ステータス
* アプリ公開
* AquesTalk2の音声の再生に対応
* (NEW!! 2017/3/13) AquesTalk1の音声の再生に(仮)対応。いわゆる、ゆっくり霊夢の声が使用可能に。
* (NEW!! 2017/3/16) 音量の制御機能を追加(仮対応、様子見)。
* その他、いろいろ機能追加
  * データ構造の修正に伴い、メニューから設定オールリセットが必要です。

## ダウンロード
* https://github.com/taku-o/myukkurivoice/releases

## インストール
https://github.com/taku-o/myukkurivoice/releases から圧縮ファイル(myukkurivoice-darwin-x64.zip)を  
ダウンロードして解凍後、  
初回の起動は myukkurivoice.app を右クリックして「開く」を選択してください。

## リリースノート
* https://github.com/taku-o/myukkurivoice/blob/master/docs/release.md

## 主な特徴
### 基本
* MacOSX Sierra以降で動作検証。
* 設定を用意して切り替えて作業するスタイルで利用します。

<img src="https://github.com/taku-o/myukkurivoice/blob/master/docs/images/readme.gif" width="400">

### ショートカット
* 動画制作向きのショートカットキーがいくつか定義されています

<img src="https://github.com/taku-o/myukkurivoice/blob/master/docs/images/readme-shortcut-play.png" width="400">

### ファイルの出力オプション
1ファイルごとにファイル名を指定して保存する方法以外に、  
音声ファイルを連番付きのファイル名で保存したり、  
音声ファイルの元となったメッセージを保存する機能があります。

<kbd><img src="https://github.com/taku-o/myukkurivoice/blob/master/docs/images/readme-filewriteopt.png" width="400"></kbd>

### 選択した範囲のテキストのみの音声再生・録音
* 選択した範囲のテキストを再生、録音する機能があります。

<kdb><img src="https://github.com/taku-o/myukkurivoice/blob/master/docs/images/readme-select-encoded.png" width="400"></kbd>

### その他
* チュートリアル、ヘルプが用意されています

<img src="https://github.com/taku-o/myukkurivoice/blob/master/docs/images/readme-tutorial.png" width="400">

### 機能一覧
* AquesTalk1, AquesTalk2ベースのメッセージ音声再生、音声録音機能
* 音記号列の表示編集、および、変更後音記号列の音声再生機能
* テキストエリアで選択したテキスト部分のみを音声再生、音声録音
* 設定の保存、複製。設定に名前をつけて複数の設定を保存可能。
* ファイル名を指定しての音声ファイル保存。連番ファイルでの音声ファイル保存の選択可能
* 音声保存時に、音声の元となったメッセージもテキストファイルに保存
* 音量、再生速度の調整。音質の調整。
* 再生する音声の抑揚のON・OFF切替
* 各種ショートカットキー
* チュートリアル

### 用意されている声一覧
| 声                 |            |
|:-------------------|:-----------|
| f1 女声1(ゆっくり) | AquesTalk1 |
| m1 男声1           | AquesTalk1 |
| f1c 女声           | AquesTalk2 |
| f3a 女声           | AquesTalk2 |
| huskey ハスキー    | AquesTalk2 |
| m4b 男声           | AquesTalk2 |
| mf1 中性的         | AquesTalk2 |
| rb2 小さいロボ     | AquesTalk2 |
| rb3 ロボ           | AquesTalk2 |
| rm 女声            | AquesTalk2 |
| robo ロボット      | AquesTalk2 |
| aq_yukkuri         | AquesTalk2 |
| f4 女声            | AquesTalk2 |
| m5 男声            | AquesTalk2 |
| mf2 機械声         | AquesTalk2 |
| rm3 女声           | AquesTalk2 |
| aq_defo1           | AquesTalk2 |
| aq_momo1           | AquesTalk2 |
| aq_teto1           | AquesTalk2 |

## 動画
[![](http://img.youtube.com/vi/DUbXHZrW1Ms/0.jpg)](https://www.youtube.com/watch?v=DUbXHZrW1Ms)

[![](http://img.youtube.com/vi/povuqyEl6L4/0.jpg)](https://www.youtube.com/watch?v=povuqyEl6L4)


