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

## library for binary
* native関連のバイナリのバージョン管理が厳しいものはレポジトリ内で直接管理しています。

```
  - ref
  - ref-struct
  - ffi
```

## 開発の進め方
* セットアップ
** 最初に動作に必要なモジュールを取り込んでください。

```
  npm install
  git submodule update --init
```

* ソースコードを修正します。ソースコードはtypescriptで記載されています。
* tscコマンドでtypescriptをビルドします。

```
  npm run tsc
```

* 次のコマンドでElectronアプリをビルドします。

```
  npm run package
```

* デバッグモードで動かして、動作を確認しましょう。

```
  npm run app
```

## リリース
* リリース用のアプリケーションを作成するにはリリース用のコマンドを実行します。

```
  npm run release
```

## 開発テスト
### 単体テスト
* 単体テストを実行するには、次のコマンドを実行します。
* テストコードはtestディレクトリ以下にあります。

```
  # build app, and run test
  npm run test_rebuild
  
  # run test already built app
  npm run test
```

### Lint
* Lintツールは次のコマンドで実行できます。

```
  npm run lint
```

# 環境設定まわりの情報
## install xcode

```
  xcode-select --install
```

## install node

```
  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | bash
  nvm ls-remote
  nvm install v8.2.1
  nvm use v8.2.1
```

## install capistrano

```
  gem install bundler
  bundle install
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

```
  brew install ffmpeg
  ffmpeg -i readme-dnd.mov -r 10 -s 692x443 -an readme-dnd.gif
```

