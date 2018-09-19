# 開発用の情報
## vendor
* ライセンスの関係上、公開されているソースコードにAquesTalkのライブラリは含まれていません。
* レポジトリで公開されているコードを動作させるには、vendorディレクトリにAquesTalkのライブラリを入れる必要があります。
* ディレクトリ構成

```
  vendor
    +-- AquesTalk.framework   AquesTalkフレームワーク
    +-- AquesTalk2.framework  AquesTalkフレームワーク
    +-- AquesTalk10.framework AquesTalkフレームワーク
    +-- AqKanji2Koe.framework AquesTalkフレームワーク
    +-- phont                 AquesTalk音声設定
    +-- aq_dic_large          AquesTalk辞書
    +-- maquestalk1           AquesTalk1フレームワークbridge
    +-- secret                AquesTalk10ライセンスキー取得コード
```

## セットアップ
* 必要なモジュールの取り込み

```
  npm install
  git submodule update --init
```

## デバッグ実行
* デバッグモードでアプリケーションを実行するには、環境変数でDEBUGを設定して実行します。

```
  DEBUG=1 electron .

  # or this command
  npm run app
```

## パッケージング
* リリーステスト用のアプリケーションを作成するには、次のコマンドを実行します。

```
  npm run package
```

* リリース用のアプリケーションを作成するには上で作ったアプリを固めるか、リリース用のコマンドを実行します。

```
  npm run release
```

## 単体テスト
* 単体テストを実行するには、次のコマンドを実行します。
* テストコードはtestディレクトリ以下にあります。
* spectronのmiddleバージョンはelectronのバージョンと合わせる必要があります。

```
  # build app, and run test
  npm run test_rebuild
  
  # run test already built app
  npm run test
```

## Lint
* Lintツールを実行します。

```
  npm run lint
```

## typescript
* ソースコードはタイプスクリプトで記載されています。
* tscコマンドでタイプスクリプトをビルドします。

```
  npm run tsc
```

## devtron
* devtronを使用するには、デバッグモードで次のコマンドを実行してください。

```
  npm install --save-dev devtron
  require('devtron').install()
```

## asarの解凍
* asarでパッケージングされたファイルを解凍するには、asarコマンドを実行します

```
  asar e app.asar dest
```

# 環境設定まわりの情報
## install xcode
    xcode-select --install

## install node
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | bash
    nvm ls-remote
    nvm install v8.2.1
    nvm use v8.2.1

## install capistrano
    gem install bundler
    bundle install

## using library
* native関連のバイナリ管理がキツいものはレポジトリ内で管理しています。
* このコマンドは実行しなくて良い。

```
  npm install --save ref
  npm install --save ref-struct
  npm install --save ffi
```

### Module version mismatch. Expected 50, got 51
* もし、この類のエラーに遭遇したら、次のようなコマンドを実行してrebuildする

```
  npm rebuild --runtime=electron --target=1.7.9 --disturl=https://atom.io/download/atom-shell --abi=51
```

# その他
## アプリアイコンの作成
* iconutilで作成します。
* icns/myukkurivoice.iconset にアイコン画像を入れてコマンド実行してください
* myukkurivoice.icns がアプリケーションアイコンです。

```
  cd icns
  iconutil --convert icns --output myukkurivoice.icns myukkurivoice.iconset
```

## README用のアニメーションGIFの作成
    brew install ffmpeg
    ffmpeg -i readme-dnd.mov -r 10 -s 692x443 -an readme-dnd.gif

