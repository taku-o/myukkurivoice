# 開発用の情報

## releases document memo.

- GitHub releases の最後に、ファイルの説明を入れる。

| ファイル名                            | 説明                                                     |
| :------------------------------------ | :------------------------------------------------------- |
| **MYukkuriVoice-darwin-x64.zip**      | MYukkuriVoice アプリ。**これをダウンロードしましょう。** |
| MYukkuriVoice-darwin-x64-nosigned.zip | MYukkuriVoice アプリ(未署名版)                           |

- Final Cut Pro X 用フォルダーアクション
  - https://github.com/taku-o/fcpx-audio-role-workflow/releases

## vendor

- ライセンスの関係上、公開されているソースコードに AquesTalk のライブラリは含まれていません。
- レポジトリで公開されているコードを動作させるには、vendor ディレクトリに AquesTalk のライブラリを入れる必要があります。
- ディレクトリ構成

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
    +-- maquestalk1-ios           AquesTalk1 iOSフレームワークbridge
    +-- secret                    AquesTalk10ライセンスキー取得コード
```

## library for binary

- native 関連のバイナリのバージョン管理が厳しいものはレポジトリ内で直接管理しています。

```
  - ffi-napi 2.4.5
    - bindings 1.5.0
    - debug 4.1.1
    - file-uri-to-path 1.0.0
    - get-symbol-from-current-process-h 1.0.1
    - get-uv-event-loop-napi-h 1.0.5
    - ms 2.1.1
    - node-addon-api 1.5.0
    - ref-napi 1.4.2
    - ref-struct-di 1.1.0
```

## 開発の進め方

- セットアップ
  - 最初に動作に必要なモジュールを取り込んでください。

```
  npm install
  git submodule update --init
```

- 次のコマンドでアプリを実際に動かしてみましょう。

```
  npx gulp app
```

## リリース

- リリースコマンドで、リリース用のビルドの作成と、配布用 zip ファイルを作成します。

```
  npx gulp build:release
```

## 開発

### ソースコードの修正

- ソースコードは typescript で記載されています。
- tsc コマンドでビルドします。

```
  npx gulp tsc
```

### 簡易パッケージング

- 次のコマンドで Electron アプリを簡易ビルドできます。

```
  npx gulp package
```

### 特定バージョンのアプリのビルド

- staging コマンドで特定のブランチを指定して、ビルドできます。

```
  npx gulp build:staging --branch=staging
```

### 単体テスト

- 単体テストを実行するには、次のコマンドを実行します。
- テストコードは test ディレクトリ以下にあります。
- テストは透明な画面で実行されます。画面が描画されません。

```
  # build app, and run test
  npx gulp test-rebuild

  # run test already built app
  npx gulp test
```

### 開発関連の機能

```
  npx gulp tsc
  npx gulp lint
  npx gulp format
  npx gulp less
  npx gulp clean
  npx gulp app
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
  nvm install v12.4.0
  nvm use v12.4.0
  nvm alias default v12.4.0
```

### Module version mismatch. Expected 50, got 51

- もし、この類のエラーに遭遇したら、次のようなコマンドを実行して rebuild する

```
  ./node_modules/.bin/electron-rebuild
```

# その他

## アプリアイコンの作成

- iconutil で作成します。
- icns/myukkurivoice.iconset にアイコン画像を入れてコマンド実行してください
- myukkurivoice.icns がアプリケーションアイコンです。

```
  cd icns
  iconutil --convert icns --output myukkurivoice.icns myukkurivoice.iconset
```

## アイコンファイルの入手

- https://material.io/tools/icons/

## README 用のアニメーション GIF の作成

- animation GIF の作成

```
  brew install ffmpeg
  ffmpeg -i readme-dnd.mov -r 10 -s 692x443 -an readme-dnd.gif
```

- animation GIF を個別の画像ファイルに分割

```
  convert -coalesce readme-dnd.gif readme-dnd-splitted-%03d.png
```

- animation GIF のサイズを縮小する

```
  gifsicle -O2 --colors 256 readme.gif > readme-mini.gif
  convert readme-mini.gif -coalesce -scale 50% -deconstruct -fuzz 2% -dither none -layers optimize -matte -depth 8 \( -clone 0--1 -background none +append -quantize transparent  -colors 32  -unique-colors -write mpr:cmap +delete \) -map mpr:cmap readme-mini2.gif
```

- png ファイルのサイズを縮小する

```
  convert  -scale 30%  -unsharp 2x1.4+0.5+0 -colors 65 -quality 100 readme-tutorial.png readme-tutorial-mini.png
```

## 実行ファイルから不要なアーキテクチャー(i386)を削る

```
for i in \
    AqKanji2Koe.framework/Versions/A/AqKanji2Koe \
    AquesTalk2.framework/AquesTalk2 \
    AquesTalk2.framework/Versions/Current/AquesTalk2 \
    AquesTalk2.framework/Versions/A/AquesTalk2 \
    AquesTalk10.framework/Versions/A/AquesTalk \
    AqUsrDic.framework/Versions/A/AqUsrDic
do
    lipo -remove i386 -output $i $i
done
```

## related project links.

- myukkurivoice (https://github.com/taku-o/myukkurivoice)
  - myukkurivoice-keys (https://github.com/taku-o/myukkurivoice-keys)
  - myukkurivoice-vendor (https://github.com/taku-o/myukkurivoice-vendor)
    - myukkurivoice-secret (https://github.com/taku-o/myukkurivoice-secret)
    - maquestalk1 (https://github.com/taku-o/maquestalk1)
    - maquestalk1-ios (https://github.com/taku-o/maquestalk1-ios)
  - electron-path (https://github.com/taku-o/electron-path)
  - fcpx-audio-role-encoder (https://github.com/taku-o/fcpx-audio-role-encoder)
  - github-version-compare (https://github.com/taku-o/github-version-compare)
  - wav-audio-length (https://github.com/taku-o/wav-audio-length)
  - caller-position (https://github.com/taku-o/caller-position)
  - electron-performance-monitor (https://github.com/taku-o/electron-performance-monitor)
  - wav-fmt-validator (https://github.com/taku-o/wav-fmt-validator)
  - myukkurivoice-about-window (https://github.com/taku-o/myukkurivoice-about-window)
- fcpx-audio-role-workflow (https://github.com/taku-o/-audio-role-workflow)
  - fcpx-audio-role-encoder (https://github.com/taku-o/fcpx-audio-role-encoder)
