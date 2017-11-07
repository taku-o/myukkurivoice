# 開発用の情報
## vendor
* ライセンスの関係上、公開されているソースコードにAquesTalkのライブラリは含まれていません。
* レポジトリで公開されているコードを動作させるには、vendorディレクトリにAquesTalkのライブラリを入れる必要があります。
* ディレクトリ構成

```
  vendor
    +-- AqKanji2Koe.framework AquesTalkフレームワーク
    +-- AquesTalk2.framework  AquesTalkフレームワーク
    +-- AquesTalk.framework   AquesTalkフレームワーク
    +-- phont                 AquesTalk音声設定
    +-- aq_dic_large          AquesTalk辞書
    +-- maquestalk1           AquesTalk1フレームワークbridge
```

## アプリデバッグ実行
* デバッグモードでアプリケーションを実行するには、環境変数でDEBUGを設定します。

    DEBUG=1 electron .

## using devtron
* devtronを使用するには、デバッグモードで次のコマンドを実行します。

    npm install --save-dev devtron
    require('devtron').install()

## アプリアイコンの作成
* iconutilで作成します。
* icns/myukkurivoice.iconset にアイコン画像を入れてコマンド実行してください
* myukkurivoice.icns がアプリケーションアイコンです。

    cd icns
    iconutil --convert icns --output myukkurivoice.icns myukkurivoice.iconset

## パッケージング
* リリーステスト用のアプリケーションを作成するには、次のコマンドを実行します。

    bin/packaging.sh
    # or
    electron-packager . myukkurivoice --platform=darwin --arch=x64 --electronVersion=1.7.9 --icon=icns/myukkurivoice.icns --overwrite --ignore="(\.gitignore|\.gitmodules|docs|icns|README.md|vendor/aqk2k_mac|vendor/aqtk1-mac|vendor/aqtk2-mac)" --asar.unpackDir=vendor

* リリース用のアプリケーションを作成するには上で作ったアプリを固めるか、リリース用のコマンドを実行します。

    bin/relase.sh

## asarの解凍
* asarでパッケージングされたファイルを解凍するには、asarコマンドを実行します

    npm -g install asar
    asar e app.asar dest

# 環境設定まわりの情報
## install xcode
    xcode-select --install

## install node
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | bash
    nvm ls-remote
    nvm install v8.2.1
    nvm use v8.2.1

## install electron and command
    npm install -g electron
    npm -g install electron-packager

## install capistrano
    gem install bundler
    bundle install

## using library
* node_modules以下に入っているので、このコマンドは実行しなくて良い。

    npm install --save angular
    npm install --save angular-input-highlight
    npm install --save https://github.com/connors/photon
    npm install --save electron-json-storage
    npm install --save electron-config
    npm install --save electron-log
    npm install --save electron-localshortcut
    npm install --save ref
    npm install --save ffi
    npm install --save intro.js
    npm install --save temp
    npm install --save wave-recorder
    npm install --save tunajs

## Module version mismatch. Expected 50, got 51
* もし、この類のエラーに遭遇したら、次のようなコマンドを実行してrebuildする

    npm rebuild --runtime=electron --target=1.7.9 --disturl=https://atom.io/download/atom-shell --abi=51


