'use strict';
import {app, Menu, shell} from 'electron';

// env
const DEBUG = process.env.DEBUG != null;

class FnMenu implements yubo.FnMenu {
  constructor() {}

  // application menu
  initAppMenu(): void {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    const menuList: Electron.MenuItemConstructorOptions[] = [
      {
        label: 'MYukkuriVoice',
        submenu: [
          {
            label: 'MYukkuriVoiceについて',
            click() { myApp.showAboutWindow(); },
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
            label: 'サービス',
          },
          {type: 'separator'},
          {
            role: 'hide',
            label: 'MYukkuriVoiceを隠す',
          },
          {
            role: 'hideOthers',
            label: '他を隠す',
          },
          {
            role: 'unhide',
            label: 'すべてを表示',
          },
          {type: 'separator'},
          {
            role: 'quit',
            label: 'MYukkuriVoiceを終了',
            accelerator: 'Command+Q',
          },
        ],
      },
      {
        label: '編集',
        submenu: [
          {
            role: 'undo',
            label: '元に戻す',
          },
          {
            role: 'redo',
            label: 'やり直す',
          },
          {type: 'separator'},
          {
            role: 'cut',
            label: '切り取り',
          },
          {
            role: 'copy',
            label: 'コピー',
          },
          {
            role: 'paste',
            label: 'ペースト',
          },
          {
            role: 'pasteAndMatchStyle',
            label: 'ペースとしてスタイルを合わせる',
          },
          {
            role: 'delete',
            label: '削除',
          },
          {
            role: 'selectAll',
            label: 'すべてを選択',
          },
          {type: 'separator'},
          {label: 'スピーチ',
            submenu: [
              {
                role: 'startSpeaking',
                label: '読み上げを開始',
              },
              {
                role: 'stopSpeaking',
                label: '読み上げを停止',
              },
            ],
          },
        ],
      },
      {
        label: '履歴',
        role: 'recentDocuments',
        submenu: [
          {
            label: '履歴のクリア',
            role: 'clearRecentDocuments',
          },
        ],
      },
      {
        label: '音声',
        submenu: [
          {
            label: 'メッセージ入力欄に移動 (⌘↑)',
            //accelerator: 'Command+Up',
            //registerAccelerator: false,
            click() { myApp.mainWindow.webContents.send('shortcut', 'moveToSource'); },
          },
          {
            label: '音記号列入力欄に移動 (⌘↓)',
            //accelerator: 'Command+Down',
            //registerAccelerator: false,
            click() { myApp.mainWindow.webContents.send('shortcut', 'moveToEncoded'); },
          },
          {type: 'separator'},
          {
            label: '音記号列に変換 (⌘→)',
            //accelerator: 'Command+Right',
            //registerAccelerator: false,
            click() { myApp.mainWindow.webContents.send('shortcut', 'encode'); },
          },
          {
            label: '入力をクリア',
            click() { myApp.mainWindow.webContents.send('menu', 'clear'); },
          },
          {
            label: 'クリップボードからコピー (⌘D)',
            //accelerator: 'Command+D',
            //registerAccelerator: false,
            click() { myApp.mainWindow.webContents.send('shortcut', 'fromClipboard'); },
          },
          {
            label: '選択中の声種プリセットを挿入 (⌘N)',
            //accelerator: 'Command+N',
            //registerAccelerator: false,
            click() { myApp.mainWindow.webContents.send('shortcut', 'putVoiceName'); },
          },
          {type: 'separator'},
          {
            label: '音声の再生 (⌘P)',
            //accelerator: 'Command+P',
            //registerAccelerator: false,
            click() { myApp.mainWindow.webContents.send('shortcut', 'play'); },
          },
          {
            label: '再生停止 (⌘W)',
            //accelerator: 'Command+W',
            //registerAccelerator: false,
            click() { myApp.mainWindow.webContents.send('shortcut', 'stop'); },
          },
          {
            label: '音声の保存 (⌘S)',
            //accelerator: 'Command+S',
            //registerAccelerator: false,
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
            //registerAccelerator: false,
            click() { myApp.mainWindow.webContents.send('shortcut', 'swichNextConfig'); },
          },
          {
            label: '前の設定に切り替え (⌘⇧←)',
            //accelerator: 'Command+Shift+Left',
            //registerAccelerator: false,
            click() { myApp.mainWindow.webContents.send('shortcut', 'swichPreviousConfig'); },
          },
          {type: 'separator'},
          {
            label: 'ボイス設定オールリセット',
            click() { myApp.resetVoiceDataOnMain(); },
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
            //registerAccelerator: false,
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
            //registerAccelerator: false,
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
            //registerAccelerator: false,
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
            click() { if (myApp.dictWindow) { myApp.resetDictionaryData(); } },
          },
        ],
      },
      {
        label: 'ウィンドウ',
        role: 'window',
        submenu: [
          {
            label: '前面表示固定切替',
            click() { myApp.mainWindow.webContents.send('menu', 'switchAlwaysOnTop'); },
          },
          {type: 'separator'},
          {
            role: 'reload',
            label: 'リロード',
          },
          {
            role: 'zoomIn',
            label: '拡大',
          },
          {
            role: 'zoomOut',
            label: '縮小',
          },
          {
            role: 'resetZoom',
            label: '拡大縮小解除',
          },
          {
            role: 'togglefullscreen',
            label: 'フルスクリーン化・解除',
          },
          {
            label: 'すべてを手前に移動',
            role: 'front',
          },
          {type: 'separator'},
          {
            label: 'ウインドウサイズリセット',
            click() { myApp.resetWindowSize(); },
          },
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
            label: 'ヘルプビューワ',
            click() { myApp.showHelpWindow(); },
          },
          {
            id: 'open-help-search',
            enabled: false,
            label: 'ヘルプ検索 (⌘F)',
            //accelerator: 'Command+F',
            //registerAccelerator: false,
            click() { if (myApp.helpWindow) { myApp.helpWindow.webContents.send('shortcut', 'openSearchForm'); } },
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
            label: 'もっと詳しく知る',
            click() { shell.openExternal('https://taku-o.github.io/myukkurivoice/'); },
          },
        ],
      },
    ];
    // アプリケーションフォルダに移動するメニューを追加
    if (!app.isInApplicationsFolder()) {
      (menuList[0].submenu as Electron.MenuItemConstructorOptions[]).splice(1, 0,
        {
          label: 'アプリケーションフォルダに移動する',
          click() { app.moveToApplicationsFolder(); },
        }
      );
    }
    // MacAppStoreでなければ、アップデート確認メニューを追加
    if (process.mas !== true) {
      (menuList[0].submenu as Electron.MenuItemConstructorOptions[]).splice(1, 0,
        {
          label: 'アップデートを確認する',
          click() { myApp.checkForUpdates(); },
        },
      );
    }
    // Debugメニューを追加 (Toggle Developer Tools、Install Devtron)
    if (DEBUG) {
      menuList.splice(6, 0,
        {
          label: 'Debug',
          submenu: [
            {role: 'toggleDevTools'},
            {
              label: 'Install Devtron',
              click() { myApp.mainWindow.webContents.send('menu', 'devtron'); },
            },
            {type: 'separator'},
            {
              label: 'Garbage Collection',
              click() { myApp.mainWindow.webContents.send('menu', 'gc'); },
            },
          ],
        }
      );
    }
    // @ts-ignore
    const menuTemplate: Electron.Menu = Menu.buildFromTemplate(menuList);
    Menu.setApplicationMenu(menuTemplate);
  }

  // dock menu
  initDockMenu(): void {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    const dockMenuList: Electron.MenuItemConstructorOptions[] = [
      {
        label: 'MYukkuriVoiceについて',
        click() { myApp.showAboutWindow(); },
      },
      {
        label: '環境設定',
        click() { myApp.showSystemWindow(); },
      },
      {
        label: 'ヘルプビューワ',
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
    const dockMenu: Electron.Menu = Menu.buildFromTemplate(dockMenuList);
    app.dock.setMenu(dockMenu);
  }

  dictMenuItems(): string[] {
    return [
      'dict-close',
      'dict-tutorial',
      'dict-add',
      'dict-delete',
      'dict-save',
      'dict-cancel',
      'dict-export',
      'dict-reset',
    ];
  }
  enableDictMenu(): void {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    const menu = Menu.getApplicationMenu();
    if (!menu) { return; }
    for (let m of myApp.dictMenuItems()) {
      const item = menu.getMenuItemById(m);
      item.enabled = true;
    }
  }
  disableDictMenu(): void {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    const menu = Menu.getApplicationMenu();
    if (!menu) { return; }
    for (let m of myApp.dictMenuItems()) {
      const item = menu.getMenuItemById(m);
      item.enabled = false;
    }
  }

  helpMenuItems(): string[] {
    return [
      'open-help-search',
    ];
  }
  enableHelpMenu(): void {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    const menu = Menu.getApplicationMenu();
    if (!menu) { return; }
    for (let m of myApp.helpMenuItems()) {
      const item = menu.getMenuItemById(m);
      item.enabled = true;
    }
  }
  disableHelpMenu(): void {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    const menu = Menu.getApplicationMenu();
    if (!menu) { return; }
    for (let m of myApp.helpMenuItems()) {
      const item = menu.getMenuItemById(m);
      item.enabled = false;
    }
  }
}

export default FnMenu;
