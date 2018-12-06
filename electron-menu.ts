'use strict';
import {app,Menu,shell} from 'electron';

// env
const DEBUG = process.env.DEBUG != null;

// application menu
function initAppMenu(): void {
  const myApp = this;
  const menuList = [
    {
      label: 'MYukkuriVoice',
      submenu: [
        {
          label: 'About MYukkuriVoice',
          click() { myApp.showAboutWindow(); },
        },
        {
          label: 'アップデートを確認する',
          click() { myApp.showVersionDialog(); },
        },
        {type: 'separator'},
        {
          label: '環境設定',
          click() { myApp.showSystemWindow(); },
        },
        {type: 'separator'},
        {
          label: '環境設定初期化',
          click() { myApp.resetAppConfigOnMain(); },
        },
        {type: 'separator'},
        {
          role: 'services',
          submenu: [],
        },
        {type: 'separator'},
        {
          role: 'quit',
          accelerator: 'Command+Q',
        },
      ],
    },
    {
      label: '編集',
      submenu: [
        {role: 'undo'},
        {role: 'redo'},
        {type: 'separator'},
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'pasteandmatchstyle'},
        {role: 'delete'},
        {role: 'selectall'},
        {type: 'separator'},
        {label: 'Speech',
          submenu: [
            {role: 'startspeaking'},
            {role: 'stopspeaking'},
          ],
        },
      ],
    },
    {
      label: '履歴',
      submenu: [
        //{
        //  label: 'Open Recent',
        //  // currently not supported.
        //  role: 'recentdocuments',
        //},
        //{type: 'separator'},
        {
          label: 'Clear Recent',
          // currently not supported.
          //role: 'clearrecentdocuments'
          click() { myApp.mainWindow.webContents.send('menu', 'clearRecentDocuments'); },
        },
      ],
    },
    {
      label: '音声',
      submenu: [
        {
          label: 'メッセージ入力欄に移動 (⌘↑)',
          //accelerator: 'Command+Up',
          click() { myApp.mainWindow.webContents.send('shortcut', 'moveToSource'); },
        },
        {
          label: '音記号列入力欄に移動 (⌘↓)',
          //accelerator: 'Command+Down',
          click() { myApp.mainWindow.webContents.send('shortcut', 'moveToEncoded'); },
        },
        {type: 'separator'},
        {
          label: '音記号列に変換 (⌘→)',
          //accelerator: 'Command+Right',
          click() { myApp.mainWindow.webContents.send('shortcut', 'encode'); },
        },
        {
          label: '入力をクリア',
          click() { myApp.mainWindow.webContents.send('menu', 'clear'); },
        },
        {
          label: 'クリップボードからコピー (⌘D)',
          //accelerator: 'Command+D',
          click() { myApp.mainWindow.webContents.send('shortcut', 'fromClipboard'); },
        },
        {
          label: '選択中の声種プリセットを挿入 (⌘N)',
          //accelerator: 'Command+N',
          click() { myApp.mainWindow.webContents.send('shortcut', 'putVoiceName'); },
        },
        {type: 'separator'},
        {
          label: '音声の再生 (⌘P)',
          //accelerator: 'Command+P',
          click() { myApp.mainWindow.webContents.send('shortcut', 'play'); },
        },
        {
          label: '再生停止 (⌘W)',
          //accelerator: 'Command+W',
          click() { myApp.mainWindow.webContents.send('shortcut', 'stop'); },
        },
        {
          label: '音声の保存 (⌘S)',
          //accelerator: 'Command+S',
          click() { myApp.mainWindow.webContents.send('shortcut', 'record'); },
        },
      ],
    },
    {
      label: 'ボイス設定',
      submenu: [
        {
          label: '新規作成',
          click() { myApp.mainWindow.webContents.send('menu', 'plus'); },
        },
        {
          label: '複製',
          click() { myApp.mainWindow.webContents.send('menu', 'copy'); },
        },
        {
          label: '削除',
          click() { myApp.mainWindow.webContents.send('menu', 'minus'); },
        },
        {type: 'separator'},
        {
          label: '保存',
          click() { myApp.mainWindow.webContents.send('menu', 'save'); },
        },
        {type: 'separator'},
        {
          label: '次の設定に切り替え (⌘←)',
          //accelerator: 'Command+Left',
          click() { myApp.mainWindow.webContents.send('shortcut', 'swichNextConfig'); },
        },
        {
          label: '前の設定に切り替え (⇧⌘←)',
          //accelerator: 'Command+Shift+Left',
          click() { myApp.mainWindow.webContents.send('shortcut', 'swichPreviousConfig'); },
        },
        {type: 'separator'},
        {
          label: 'ボイス設定オールリセット',
          click() { myApp.mainWindow.webContents.send('menu', 'reset'); },
        },
      ],
    },
    {
      label: '辞書',
      submenu: [
        {
          label: '辞書ツール',
          click() { myApp.showDictWindow(); },
        },
        {
          id: 'dict-close',
          enabled: false,
          label: '辞書を閉じる (⌘W)',
          //accelerator: 'Command+W',
          click() { if (myApp.dictWindow) { myApp.dictWindow.close(); } },
        },
        {
          id: 'dict-tutorial',
          enabled: false,
          label: '辞書チュートリアル',
          click() { if (myApp.dictWindow) { myApp.dictWindow.webContents.send('menu', 'tutorial'); } },
        },
        {type: 'separator'},
        {
          id: 'dict-add',
          enabled: false,
          label: '定義データ追加 (⌘N)',
          //accelerator: 'Command+N',
          click() { if (myApp.dictWindow) { myApp.dictWindow.webContents.send('menu', 'add'); } },
        },
        {
          id: 'dict-delete',
          enabled: false,
          label: '定義データ削除',
          click() { if (myApp.dictWindow) { myApp.dictWindow.webContents.send('menu', 'delete'); } },
        },
        {type: 'separator'},
        {
          id: 'dict-save',
          enabled: false,
          label: '保存 (⌘S)',
          //accelerator: 'Command+S',
          click() { if (myApp.dictWindow) { myApp.dictWindow.webContents.send('menu', 'save'); } },
        },
        {
          id: 'dict-cancel',
          enabled: false,
          label: 'キャンセル',
          click() { if (myApp.dictWindow) { myApp.dictWindow.webContents.send('menu', 'cancel'); } },
        },
        {
          id: 'dict-export',
          enabled: false,
          label: 'エクスポート',
          click() { if (myApp.dictWindow) { myApp.dictWindow.webContents.send('menu', 'export'); } },
        },
        {type: 'separator'},
        {
          id: 'dict-reset',
          enabled: false,
          label: '辞書オールリセット',
          click() { if (myApp.dictWindow) { myApp.dictWindow.webContents.send('menu', 'reset'); } },
        },
      ],
    },
    {
      label: 'ウィンドウ',
      submenu: [
        {
          label: '前面表示固定切替',
          click() { myApp.switchAlwaysOnTop(); },
        },
        {type: 'separator'},
        {role: 'reload'},
        {role: 'zoomin'},
        {role: 'zoomout'},
        {role: 'resetzoom'},
        {role: 'togglefullscreen'},
        {
          label: 'Bring All to Front',
          role: 'front',
        },
        {type: 'separator'},
        {
          label: 'ウインドウ位置リセット',
          click() { myApp.resetWindowPosition(); },
        },
      ],
    },
    {
      label: 'ヘルプ',
      submenu: [
        {
          label: 'ヘルプ',
          click() { myApp.showHelpWindow(); },
        },
        {type: 'separator'},
        {
          label: 'ショートカットキー',
          click() { myApp.mainWindow.webContents.send('menu', 'shortcut'); },
        },
        {
          label: 'チュートリアル',
          click() { myApp.mainWindow.webContents.send('menu', 'tutorial'); },
        },
        {type: 'separator'},
        {
          label: 'Learn More',
          click() { shell.openExternal('https://taku-o.github.io/myukkurivoice/'); },
        },
      ],
    },
  ];
  // Debugメニューを追加 (Toggle Developer Tools、Install Devtron)
  if (DEBUG) {
    (menuList as any[]).splice(6, 0,
      {
        label: 'Debug',
        submenu: [
          {role: 'toggledevtools'},
          {
            label: 'Install Devtron',
            click() { myApp.mainWindow.webContents.send('menu', 'devtron'); },
          },
        ],
      }
    );
  }
  // @ts-ignore
  const menuTemplate = Menu.buildFromTemplate(menuList);
  Menu.setApplicationMenu(menuTemplate);
}

// dock menu
function initDockMenu(): void {
  const myApp = this;
  const dockMenuList = [
    {
      label: 'About MYukkuriVoice',
      click() { myApp.showAboutWindow(); },
    },
    {
      label: '環境設定',
      click() { myApp.showSystemWindow(); },
    },
    {
      label: 'ヘルプ',
      click() { myApp.showHelpWindow(); },
    },
    {
      label: '辞書ツール',
      click() { myApp.showDictWindow(); },
    },
    {
      label: 'ウインドウ位置リセット',
      click() { myApp.resetWindowPosition(); },
    },
  ];
  const dockMenu = Menu.buildFromTemplate(dockMenuList);
  app.dock.setMenu(dockMenu);
}

const dictMenuItems = [
  'dict-close',
  'dict-tutorial',
  'dict-add',
  'dict-delete',
  'dict-save',
  'dict-cancel',
  'dict-export',
  'dict-reset',
];
function enableDictMenu(): void {
  const menu = Menu.getApplicationMenu();
  if (!menu) { return; }
  for (let m of dictMenuItems) {
    const item = menu.getMenuItemById(m);
    item.enabled = true;
  }
}
function disableDictMenu(): void {
  const menu = Menu.getApplicationMenu();
  if (!menu) { return; }
  for (let m of dictMenuItems) {
    const item = menu.getMenuItemById(m);
    item.enabled = false;
  }
}

// exports
export {
  initAppMenu,
  initDockMenu,
  enableDictMenu,
  disableDictMenu,
};
