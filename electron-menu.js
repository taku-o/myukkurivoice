'use strict';
const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;

// application menu
function initAppMenu() {
  var myApp = this;
  var menuList = [
    {
      label: 'MYukkuriVoice',
      submenu: [
        {
          label: 'About MYukkuriVoice',
          click () { myApp.showAboutWindow(); }
        },
        { type: 'separator' },
        {
          label: '環境設定',
          click () { myApp.showSystemWindow(); }
        },
        { type: 'separator' },
        {
          label: '環境設定初期化',
          click () { myApp.resetAppConfigOnMain(); }
        },
        { type: 'separator' },
        {
          role: 'services',
          submenu: []
        },
        { type: 'separator' },
        {
          role:'quit',
          accelerator: 'Command+Q'
        }
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
            { role: 'stopspeaking' }
          ]
        }
      ]
    },
    {
      label: '音声',
      submenu: [
        {
          label:'メッセージ入力欄に移動',
          accelerator: 'Command+Up',
          click () {
            myApp.mainWindow.webContents.send('shortcut', 'moveToSource');
          }
        },
        {
          label:'音記号列入力欄に移動',
          accelerator: 'Command+Down',
          click () {
            myApp.mainWindow.webContents.send('shortcut', 'moveToEncoded');
          }
        },
        { type: 'separator' },
        {
          label:'音記号列に変換',
          accelerator: 'Command+Right',
          click () {
            myApp.mainWindow.webContents.send('shortcut', 'encode');
          }
        },
        {
          label:'入力をクリア',
          click () {
            myApp.mainWindow.webContents.send('menu', 'clear');
          }
        },
        {
          label:'クリップボードからコピー',
          accelerator: 'Command+D',
          click () {
            myApp.mainWindow.webContents.send('shortcut', 'fromClipboard');
          }
        },
        {
          label:'選択中の声種プリセットを挿入',
          accelerator: 'Command+N',
          click () {
            myApp.mainWindow.webContents.send('shortcut', 'putVoiceName');
          }
        },
        { type: 'separator' },
        {
          label:'音声の再生',
          accelerator: 'Command+P',
          click () {
            myApp.mainWindow.webContents.send('shortcut', 'play');
          }
        },
        {
          label:'再生停止',
          accelerator: 'Command+W',
          click () {
            myApp.mainWindow.webContents.send('shortcut', 'stop');
          }
        },
        {
          label:'音声の保存',
          accelerator: 'Command+S',
          click () {
            myApp.mainWindow.webContents.send('shortcut', 'record');
          }
        }
      ]
    },
    {
      label: 'ボイス設定',
      submenu: [
        {
          label: '新規作成',
          click () {
            myApp.mainWindow.webContents.send('menu', 'plus');
          }
        },
        {
          label: '複製',
          click () {
            myApp.mainWindow.webContents.send('menu', 'copy');
          }
        },
        {
          label: '削除',
          click () {
            myApp.mainWindow.webContents.send('menu', 'minus');
          }
        },
        { type: 'separator' },
        {
          label: '保存',
          click () {
            myApp.mainWindow.webContents.send('menu', 'save');
          }
        },
        { type: 'separator' },
        {
          label: '次の設定に切り替え',
          accelerator: 'Command+Left',
          click () {
            myApp.mainWindow.webContents.send('shortcut', 'swichNextConfig');
          }
        },
        {
          label: '前の設定に切り替え',
          accelerator: 'Command+Shift+Left',
          click () {
            myApp.mainWindow.webContents.send('shortcut', 'swichPreviousConfig');
          }
        },
        { type: 'separator' },
        {
          label: 'ボイス設定オールリセット',
          click () {
            myApp.mainWindow.webContents.send('menu', 'reset');
          }
        }
      ]
    },
    {
      label: '表示',
      submenu: [
        { role: 'reload' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'ウインドウ',
      submenu: [
        {
          label: '前面表示固定切替',
          click () { myApp.switchAlwaysOnTop(); }
        },
        { type: 'separator' },
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },
        {
          label: 'Zoom',
          role: 'zoom'
        },
        { type: 'separator' },
        {
          label: 'Bring All to Front',
          role: 'front'
        },
        { type: 'separator' },
        {
          label: 'ウインドウ位置リセット',
          click () { myApp.resetWindowPosition(); }
        },
      ]
    },
    {
      label: 'ヘルプ',
      submenu: [
        {
          label: 'ヘルプ',
          click () { myApp.showHelpWindow(); }
        },
        { type: 'separator' },
        {
          label: 'ショートカットキー',
          click () {
            myApp.mainWindow.webContents.send('menu', 'shortcut');
          }
        },
        {
          label: 'チュートリアル',
          click () {
            myApp.mainWindow.webContents.send('menu', 'tutorial');
          }
        },
        { type: 'separator' },
        {
          label: 'Learn More',
          click () { require('electron').shell.openExternal('https://github.com/taku-o/myukkurivoice') }
        }
      ]
    }
  ];
  // 表示メニューにToggle Developer Toolsメニューを追加
  if (appCfg.debug) {
    menuList[4].submenu.splice(1, 0,
      { role: 'toggledevtools' }
    );
  }
  var menuTemplate = Menu.buildFromTemplate(menuList);
  Menu.setApplicationMenu(menuTemplate);
}

// dock menu
function initDockMenu() {
  var myApp = this;
  var dockMenuList = [
    {
      label: 'About MYukkuriVoice',
      click () { myApp.showAboutWindow(); }
    },
    {
      label: '環境設定',
      click () { myApp.showSystemWindow(); }
    },
    {
      label: 'ヘルプ',
      click () { myApp.showHelpWindow(); }
    },
    {
      label: 'ウインドウ位置リセット',
      click () { myApp.resetWindowPosition(); }
    }
  ];
  var dockMenu = Menu.buildFromTemplate(dockMenuList);
  app.dock.setMenu(dockMenu)
}

// exports
module.exports = {
  initAppMenu,
  initDockMenu
};
