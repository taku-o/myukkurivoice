# myukkurivoice
myukkurivoiceは、AquesTalkを利用したMac OSX向けの  
動画制作向け合成音声生成アプリケーションです。
* メインターゲット: macOS Sierra

## ステータス
* 開発中
* AquesTalk 評価版使用中

## ダウンロード
* https://github.com/taku-o/myukkurivoice/releases

# 開発用の情報
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

## using library
node_modules以下に入っているので、このコマンドは実行しなくて良い。  

    npm install --save angular
    npm install --save https://github.com/connors/photon
    npm install --save electron-json-storage
    npm install --save electron-log
    npm install --save ref
    npm install --save ffi

## アプリデバッグ実行
    electron .

## その他
### Module version mismatch. Expected 50, got 51
もし次のエラーに遭遇したら、次のコマンドを実行する

    npm rebuild --runtime=electron --target=1.4.12 --disturl=https://atom.io/download/atom-shell --abi=51

## packaging
    electron-packager . myukkurivoice --platform=darwin --arch=x64 --version=1.4.12


