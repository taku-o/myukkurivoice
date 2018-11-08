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
                        intro: 'このツールはMYukkuriVoiceアプリ用のカスタム辞書編集ツールです。'
                    },
                    {
                        element: '#grid',
                        intro: 'この表にはカスタム辞書のデータが表示されます。この辞書データはMYukkuriVoiceアプリでのメッセージの変換で利用されます。'
                    },
                    {
                        element: '#grid',
                        intro: 'この表のデータは、セルをダブルクリックすると編集できます。'
                    },
                    {
                        element: '#append-record',
                        intro: 'これらのボタンで辞書のデータを増やしたり、減らしたりできます。'
                    },
                    {
                        element: '#save',
                        intro: '編集したデータはこのボタンで保存しましょう。不正なデータがあると保存できません。'
                    },
                    {
                        element: '#export',
                        intro: 'MYukkuriVoiceアプリのカスタム辞書を更新するにはこのボタンを押します。辞書はMYukkuriVoiceアプリのメイン画面をリロードすると読み込まれます。'
                    },
                    {
                        element: '#footer',
                        intro: 'この辞書アプリで何かしら問題が発生すると、フッターにメッセージが表示されます。'
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
