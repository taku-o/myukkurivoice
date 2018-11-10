'use strict';
exports.__esModule = true;
var electron_1 = require("electron");
// application menu
function initAppMenu(options) {
    var myApp = this;
    var menuList = [
        {
            label: 'MYukkuriVoice',
            submenu: [
                {
                    label: 'About MYukkuriVoice',
                    click: function () { myApp.showAboutWindow(); }
                },
                {
                    label: 'アップデートを確認する',
                    click: function () { myApp.showVersionDialog(); }
                },
                { type: 'separator' },
                {
                    label: '環境設定',
                    click: function () { myApp.showSystemWindow(); }
                },
                { type: 'separator' },
                {
                    label: '環境設定初期化',
                    click: function () { myApp.resetAppConfigOnMain(); }
                },
                { type: 'separator' },
                {
                    role: 'services',
                    submenu: []
                },
                { type: 'separator' },
                {
                    role: 'quit',
                    accelerator: 'Command+Q'
                },
            ]
        },
        {
            label: '編集',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'pasteandmatchstyle' },
                { role: 'delete' },
                { role: 'selectall' },
                { type: 'separator' },
                { label: 'Speech',
                    submenu: [
                        { role: 'startspeaking' },
                        { role: 'stopspeaking' },
                    ]
                },
            ]
        },
        {
            label: '音声',
            submenu: [
                {
                    label: 'メッセージ入力欄に移動 (⌘↑)',
                    //accelerator: 'Command+Up',
                    click: function () { myApp.mainWindow.webContents.send('shortcut', 'moveToSource'); }
                },
                {
                    label: '音記号列入力欄に移動 (⌘↓)',
                    //accelerator: 'Command+Down',
                    click: function () { myApp.mainWindow.webContents.send('shortcut', 'moveToEncoded'); }
                },
                { type: 'separator' },
                {
                    label: '音記号列に変換 (⌘→)',
                    //accelerator: 'Command+Right',
                    click: function () { myApp.mainWindow.webContents.send('shortcut', 'encode'); }
                },
                {
                    label: '入力をクリア',
                    click: function () { myApp.mainWindow.webContents.send('menu', 'clear'); }
                },
                {
                    label: 'クリップボードからコピー (⌘D)',
                    //accelerator: 'Command+D',
                    click: function () { myApp.mainWindow.webContents.send('shortcut', 'fromClipboard'); }
                },
                {
                    label: '選択中の声種プリセットを挿入 (⌘N)',
                    //accelerator: 'Command+N',
                    click: function () { myApp.mainWindow.webContents.send('shortcut', 'putVoiceName'); }
                },
                { type: 'separator' },
                {
                    label: '音声の再生 (⌘P)',
                    //accelerator: 'Command+P',
                    click: function () { myApp.mainWindow.webContents.send('shortcut', 'play'); }
                },
                {
                    label: '再生停止 (⌘W)',
                    //accelerator: 'Command+W',
                    click: function () { myApp.mainWindow.webContents.send('shortcut', 'stop'); }
                },
                {
                    label: '音声の保存 (⌘S)',
                    //accelerator: 'Command+S',
                    click: function () { myApp.mainWindow.webContents.send('shortcut', 'record'); }
                },
            ]
        },
        {
            label: 'ボイス設定',
            submenu: [
                {
                    label: '新規作成',
                    click: function () { myApp.mainWindow.webContents.send('menu', 'plus'); }
                },
                {
                    label: '複製',
                    click: function () { myApp.mainWindow.webContents.send('menu', 'copy'); }
                },
                {
                    label: '削除',
                    click: function () { myApp.mainWindow.webContents.send('menu', 'minus'); }
                },
                { type: 'separator' },
                {
                    label: '保存',
                    click: function () { myApp.mainWindow.webContents.send('menu', 'save'); }
                },
                { type: 'separator' },
                {
                    label: '次の設定に切り替え (⌘←)',
                    //accelerator: 'Command+Left',
                    click: function () { myApp.mainWindow.webContents.send('shortcut', 'swichNextConfig'); }
                },
                {
                    label: '前の設定に切り替え (⇧⌘←)',
                    //accelerator: 'Command+Shift+Left',
                    click: function () { myApp.mainWindow.webContents.send('shortcut', 'swichPreviousConfig'); }
                },
                { type: 'separator' },
                {
                    label: 'ボイス設定オールリセット',
                    click: function () { myApp.mainWindow.webContents.send('menu', 'reset'); }
                },
            ]
        },
        {
            label: 'ウィンドウ',
            submenu: [
                {
                    label: '前面表示固定切替',
                    click: function () { myApp.switchAlwaysOnTop(); }
                },
                { type: 'separator' },
                { role: 'reload' },
                { role: 'zoomin' },
                { role: 'zoomout' },
                { role: 'resetzoom' },
                { role: 'togglefullscreen' },
                {
                    label: 'Bring All to Front',
                    role: 'front'
                },
                { type: 'separator' },
                {
                    label: 'ウインドウ位置リセット',
                    click: function () { myApp.resetWindowPosition(); }
                },
            ]
        },
        {
            label: '辞書',
            submenu: [
                {
                    label: '辞書ツール',
                    click: function () { myApp.showDictWindow(); }
                },
                {
                    id: 'dict-close',
                    enabled: false,
                    label: '辞書を閉じる (⌘W)',
                    //accelerator: 'Command+W',
                    click: function () { if (myApp.dictWindow) {
                        myApp.dictWindow.close();
                    } }
                },
                {
                    id: 'dict-tutorial',
                    enabled: false,
                    label: '辞書チュートリアル',
                    click: function () { if (myApp.dictWindow) {
                        myApp.dictWindow.webContents.send('menu', 'tutorial');
                    } }
                },
                { type: 'separator' },
                {
                    id: 'dict-add',
                    enabled: false,
                    label: '定義データ追加 (⌘N)',
                    //accelerator: 'Command+N',
                    click: function () { if (myApp.dictWindow) {
                        myApp.dictWindow.webContents.send('menu', 'add');
                    } }
                },
                {
                    id: 'dict-delete',
                    enabled: false,
                    label: '定義データ削除',
                    click: function () { if (myApp.dictWindow) {
                        myApp.dictWindow.webContents.send('menu', 'delete');
                    } }
                },
                { type: 'separator' },
                {
                    id: 'dict-save',
                    enabled: false,
                    label: '保存 (⌘S)',
                    //accelerator: 'Command+S',
                    click: function () { if (myApp.dictWindow) {
                        myApp.dictWindow.webContents.send('menu', 'save');
                    } }
                },
                {
                    id: 'dict-cancel',
                    enabled: false,
                    label: 'キャンセル',
                    click: function () { if (myApp.dictWindow) {
                        myApp.dictWindow.webContents.send('menu', 'cancel');
                    } }
                },
                {
                    id: 'dict-export',
                    enabled: false,
                    label: 'エクスポート',
                    click: function () { if (myApp.dictWindow) {
                        myApp.dictWindow.webContents.send('menu', 'export');
                    } }
                },
                { type: 'separator' },
                {
                    id: 'dict-reset',
                    enabled: false,
                    label: '辞書オールリセット',
                    click: function () { if (myApp.dictWindow) {
                        myApp.dictWindow.webContents.send('menu', 'reset');
                    } }
                },
            ]
        },
        {
            label: 'ヘルプ',
            submenu: [
                {
                    label: 'ヘルプ',
                    click: function () { myApp.showHelpWindow(); }
                },
                { type: 'separator' },
                {
                    label: 'ショートカットキー',
                    click: function () { myApp.mainWindow.webContents.send('menu', 'shortcut'); }
                },
                {
                    label: 'チュートリアル',
                    click: function () { myApp.mainWindow.webContents.send('menu', 'tutorial'); }
                },
                { type: 'separator' },
                {
                    label: 'Learn More',
                    click: function () { electron_1.shell.openExternal('https://taku-o.github.io/myukkurivoice/'); }
                },
            ]
        },
    ];
    // Debugメニューを追加 (Toggle Developer Tools、Install Devtron)
    if (options.isDebug) {
        menuList.splice(6, 0, {
            label: 'Debug',
            submenu: [
                { role: 'toggledevtools' },
                {
                    label: 'Install Devtron',
                    click: function () { myApp.mainWindow.webContents.send('menu', 'devtron'); }
                },
            ]
        });
    }
    // @ts-ignore
    var menuTemplate = electron_1.Menu.buildFromTemplate(menuList);
    electron_1.Menu.setApplicationMenu(menuTemplate);
}
exports.initAppMenu = initAppMenu;
// dock menu
function initDockMenu() {
    var myApp = this;
    var dockMenuList = [
        {
            label: 'About MYukkuriVoice',
            click: function () { myApp.showAboutWindow(); }
        },
        {
            label: '環境設定',
            click: function () { myApp.showSystemWindow(); }
        },
        {
            label: 'ヘルプ',
            click: function () { myApp.showHelpWindow(); }
        },
        {
            label: '辞書ツール',
            click: function () { myApp.showDictWindow(); }
        },
        {
            label: 'ウインドウ位置リセット',
            click: function () { myApp.resetWindowPosition(); }
        },
    ];
    var dockMenu = electron_1.Menu.buildFromTemplate(dockMenuList);
    electron_1.app.dock.setMenu(dockMenu);
}
exports.initDockMenu = initDockMenu;
