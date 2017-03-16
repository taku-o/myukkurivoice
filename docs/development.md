# 開発用の情報
## vendor
* vendorディレクトリにAquesTalkのライブラリを入れる必要があります。
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

    git submodule init
    git submodule update

## install xcode
    xcode-select --install

## install node
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | bash
    nvm ls-remote
    nvm install v7.2.0
    nvm use v7.2.0

## install electron command
    npm -g install electron-prebuilt
    npm -g install electron-packager
    npm -g install electron-osx-sign

## using library
node_modules以下に入っているので、このコマンドは実行しなくて良い。

    npm install --save angular
    npm install --save https://github.com/connors/photon
    npm install --save electron-json-storage
    npm install --save electron-log
    npm install --save electron-localshortcut
    npm install --save ref
    npm install --save ffi
    npm install --save intro.js
    npm install --save temp
    npm install --save wave-recorder

## アプリデバッグ実行
    DEBUG=1 electron .

## その他
### Module version mismatch. Expected 50, got 51
もし次のエラーに遭遇したら、次のコマンドを実行する

    npm rebuild --runtime=electron --target=1.4.12 --disturl=https://atom.io/download/atom-shell --abi=51

## icns
    cd icns
    iconutil --convert icns --output myukkurivoice.icns myukkurivoice.iconset

## using devtron
    npm install --save-dev devtron
    require('devtron').install()

## asar
    npm -g install asar
    asar e app.asar dest

## packaging
    electron-packager . myukkurivoice --platform=darwin --arch=x64 --version=1.4.12 --icon=icns/myukkurivoice.icns --overwrite --ignore="(\.gitignore|\.gitmodules|docs|icns|README.md|vendor/aqk2k_mac|vendor/aqtk1-mac|vendor/aqtk2-mac)" --asar.unpackDir=vendor

