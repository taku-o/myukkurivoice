# 開発用の情報
## vendor
* ライセンスの関係上、公開されているソースコードにAquesTalkのライブラリは含まれていません。
* レポジトリで公開されているコードを動作させるには、vendorディレクトリにAquesTalkのライブラリを入れる必要があります。
* ディレクトリ構成

```
  vendor
    +-- AquesTalk.framework       AquesTalkフレームワーク
    +-- AquesTalk2.framework      AquesTalkフレームワーク
    +-- AquesTalk10.framework     AquesTalkフレームワーク
    +-- AqKanji2Koe.framework     AquesTalkフレームワーク
    +-- AqUsrDic.framework        AquesTalkフレームワーク
    +-- phont                     AquesTalk音声設定
    +-- aq_dic_large              AquesTalk辞書
    +-- aq_dic_large/aq_user.csv  AquesTalkユーザー辞書のマスターデータCSV
    +-- maquestalk1               AquesTalk1フレームワークbridge
    +-- secret                    AquesTalk10ライセンスキー取得コード
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
  npm install -g gulp-cli
```

* ソースコードを修正します。ソースコードはtypescriptで記載されています。
* tscコマンドでtypescriptをビルドします。

```
  gulp tsc
```

* 次のコマンドでElectronアプリをビルドします。

```
  gulp package
```

* デバッグモードで動かして、動作を確認しましょう。

```
  gulp app
```

## リリース
* リリース用のアプリケーションを作成するにはリリース用のコマンドを実行します。

```
  gulp release
```

## 開発テスト
### 特定バージョンのアプリのビルド
* stagingコマンドで特定のブランチを指定して、ビルドできます。

```
  gulp staging --branch=develop
```

### 単体テスト
* 単体テストを実行するには、次のコマンドを実行します。
* テストコードはtestディレクトリ以下にあります。
* テストは透明な画面で実行されます。画面が描画されません。

```
  # build app, and run test
  gulp test-rebuild
  
  # run test already built app
  gulp test
```

### Lint
* Lintツールは次のコマンドで実行できます。

```
  gulp lint
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

## アイコンファイルの入手
* https://material.io/tools/icons/

## README用のアニメーションGIFの作成
* animation GIFの作成

```
  brew install ffmpeg
  ffmpeg -i readme-dnd.mov -r 10 -s 692x443 -an readme-dnd.gif
```

* animation GIFを個別の画像ファイルに分割

```
  convert -coalesce readme-dnd.gif readme-dnd-splitted-%03d.png
```

* animation GIFのサイズを縮小する

```
  gifsicle -O2 --colors 256 readme.gif > readme-mini.gif
  convert readme-mini.gif -coalesce -scale 50% -deconstruct -fuzz 2% -dither none -layers optimize -matte -depth 8 \( -clone 0--1 -background none +append -quantize transparent  -colors 32  -unique-colors -write mpr:cmap +delete \) -map mpr:cmap readme-mini2.gif
```

* pngファイルのサイズを縮小する
```
  convert  -scale 30%  -unsharp 2x1.4+0.5+0 -colors 65 -quality 100 readme-tutorial.png readme-tutorial-mini.png
```

