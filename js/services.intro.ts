// angular intro service
angular.module('yvoiceIntroService', [])
  .factory('IntroService', (): yubo.IntroService => {
    return {
      mainTutorial: function(): void {
        const intro = introJs();
        intro.setOption('showProgress', true);
        intro.setOptions({
          steps: [
            {
              element: '#source',
              intro: '発声したいメッセージを入力してください<br>※テキストファイルをドラッグアンドドロップしても入力できます',
            },
            {
              element: '#encode',
              intro: '音記号列へ変換します',
            },
            {
              element: '#encoded',
              intro: 'すると、メッセージが音記号列に変換した結果が入ります<br>細かい発声の調節をする時はここを変更します<br>※テキストファイルをドラッグアンドドロップしても入力できます',
            },
            {
              element: '#play',
              intro: '音記号列を発声させます',
            },
            {
              element: '#source',
              intro: '音声再生時に音記号列が入力されていない場は、ここに入力したメッセージから音声を作るので<br>音記号列は入力しなくても問題ありません',
            },
            {
              element: '#stop',
              intro: '音声の再生を停止します',
            },
            {
              element: '#record',
              intro: '発声が問題なければ、このボタンで音声データを保存できます',
            },
            {
              element: '#wav-draggable-btn',
              intro: '保存した音声データは、ここからドラッグアンドドロップで動画編集ソフトに直接渡すこともできます',
            },
            {
              element: '#phont',
              intro: '声を変えたければここを変更します',
            },
            {
              element: '#speed',
              position: 'top',
              intro: '声の早さの調節はここです',
            },
            {
              element: '#volume',
              position: 'top',
              intro: '声の音量の調節はこちらです',
            },
            {
              element: '#switch-settings-view',
              position: 'top',
              intro: 'このボタンで音声ファイルの保存方法設定画面に移ります',
            },
            {
              element: '#switch-settings-view',
              position: 'top',
              intro: '声の早さ音量以外の、多用しない系統の音声設定も設定画面にあります',
            },
            {
              element: '#always-on-top-btn',
              intro: 'このボタンを押すと、ウインドウを常に最前面で表示するようになります',
            },
            {
              element: '#tutorial',
              intro: 'チュートリアルは画面ごとに異なりますよ',
            },
            {
              element: '#save',
              intro: '変更した設定はここで保存できます',
            },
            {
              element: '#name',
              intro: '設定には名前をつけられます',
            },
            {
              element: '#sidebar-items',
              position: 'right',
              intro: '設定はこのあたりで、増やしたり、減らしたりできます',
            },
            {
              element: '#sidebar-items',
              position: 'right',
              intro: '設定がおかしくなった時はメニューに「設定オールリセット」があります',
            },
            {
              element: '#source',
              intro: '＞で区切って声設定プリセット名を指定すると、複数音声まとめて入力できます。<br><br>f1 女声1(ゆっくり)＞こんにちわ<br>aq_yukkuri(サンプル設定2)＞おはよう<br>f1c 女声(サンプル設定3)＞わーい',
            },
            {
              element: '#tutorial',
              intro: 'チュートリアルは以上です。またチュートリアルをまた確認したくなったら、ここを押してください',
            },
          ],
        });
        intro.start();
      },
      settingsTutorial: function(): void {
        const intro = introJs();
        intro.setOption('showProgress', true);
        intro.setOptions({
          steps: [
            {
              element: '#voice-tuna-box',
              intro: '音声の質の調整はここで行います',
            },
            {
              element: '#play',
              intro: '設定画面からでも音声は再生できるので、再生しながら音声を調整してみてください',
            },
            {
              element: '#source-write-box',
              intro: 'ここのチェックを入れると、音声再生時に元のメッセージも保存するようになります',
            },
            {
              element: '#seq-write-box',
              intro: 'このチェックを入れると、ファイルに連番をつけて保存するようになります。<br>出力先のディレクトリと、ファイル名を指定できます。',
            },
            {
              element: '#switch-main-view',
              intro: 'このボタンで標準の画面に戻ります',
            },
            {
              element: '#tutorial',
              intro: 'チュートリアルは画面ごとに異なりますよ',
            },
            {
              element: '#save',
              intro: '変更した設定はここで保存できます',
            },
            {
              element: '#name2',
              intro: 'この設定は音声の出力設定ごとに共有です',
            },
            {
              element: '#tutorial',
              intro: 'チュートリアルは以上です',
            },
          ],
        });
        intro.start();
      },
      shortcut: function(): void {
        const intro = introJs();
        intro.setOption('showProgress', true);
        intro.setOptions({
          steps: [
            {
              element: '#btn-group-audio',
              intro: 'Command + P で音声再生<br>Command + W で音声再生の停止<br>Command + S で音声保存',
            },
            {
              element: '#source',
              intro: 'Command + ↑ でメッセージ入力欄にカーソル移動',
            },
            {
              element: '#encoded',
              intro: 'Command + ↓ で音記号列入力欄にカーソル移動',
            },
            {
              element: '#encode',
              intro: 'Command + → で音記号列へ変換',
            },
            {
              element: '#from-clipboard',
              intro: 'Command + D でクリップボードに入っているテキストをメッセージ入力欄にコピーします',
            },
            {
              element: '#source',
              intro: 'Command + N で"声種プリセット名＞"をテキスト欄に入力します。マルチボイス機能で利用できます。',
            },
            {
              element: '#sidebar-items',
              position: 'right',
              intro: 'Command + ← で次(下)の設定に切り替え<br>Command + Shift + ← で前(上)の設定に切り替え',
            },
          ],
        });
        intro.start();
      },
    };
  });

