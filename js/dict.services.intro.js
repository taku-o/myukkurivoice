"use strict";
angular.module('dictIntroService', [])
    .factory('IntroService', function () {
    return {
        tutorial: function () {
            var intro = introJs();
            intro.setOption('showProgress', true);
            intro.setOptions({
                steps: [
                    {
                        element: '#grid',
                        intro: 'このツールはMYukkuriVoiceアプリ用のユーザー辞書編集ツールです。MYukkuriVoiceアプリでのメッセージの変換に利用される辞書を編集できます。'
                    },
                    {
                        element: '#grid',
                        intro: 'この表にはユーザー辞書のデータが表示されます。表はセルを選択すると直接データを編集できます。'
                    },
                    {
                        element: '#append-record',
                        intro: 'これらのボタンでユーザー辞書のデータを増やしたり、減らしたりできます。'
                    },
                    {
                        element: '#save',
                        intro: '編集したデータはこのボタンで保存しましょう。不正なデータがあると保存できません。'
                    },
                    {
                        element: '#export',
                        intro: 'MYukkuriVoiceアプリのユーザー辞書を更新するにはこのボタンを押します。'
                    },
                    {
                        element: '#reload',
                        intro: 'ユーザー辞書はMYukkuriVoiceアプリを再起動するか、メイン画面をリロードすると読み込まれます。'
                    },
                    {
                        element: '#footer',
                        intro: '辞書ツールで何かしら問題が発生すると、フッターにメッセージが表示されます。'
                    },
                    {
                        element: '#tutorial',
                        intro: 'チュートリアルは以上です。またチュートリアルをまた確認したくなったら、このボタンを押してください。'
                    },
                    {
                        element: '#tutorial',
                        intro: 'MYukkuriVoiceアプリのヘルプにも、この辞書ツールの説明が書いてあります。'
                    },
                ]
            });
            intro.start();
        }
    };
});
