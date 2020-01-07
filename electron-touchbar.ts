'use strict';
import {TouchBar} from 'electron';
const {TouchBarButton} = TouchBar;

class FnTouchBar implements yubo.FnTouchBar {
  constructor() {}

  private _mainTouchBar: Electron.TouchBar = null;
  getMainTouchBar(): Electron.TouchBar {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    this._mainTouchBar = this._mainTouchBar || new TouchBar({
      items: [
        new TouchBarButton({
          icon: 'images/icon_32x32@2x.png' as any,
          backgroundColor: '#000000',
        }),
        new TouchBarButton({
          label: '\u{25B6}',
          click: () => { myApp.mainWindow.webContents.send('shortcut', 'play'); },
        }),
        new TouchBarButton({
          label: '\u{25A0}',
          click: () => { myApp.mainWindow.webContents.send('shortcut', 'stop'); },
        }),
        new TouchBarButton({
          label: '\u{25CF}',
          click: () => { myApp.mainWindow.webContents.send('shortcut', 'record'); },
        }),
        new TouchBarButton({
          label: '音記号列変換',
          click: () => { myApp.mainWindow.webContents.send('shortcut', 'encode'); },
        }),
        new TouchBarButton({
          label: '\u{1F4D6}',
          click: () => { myApp.showDictWindow(); },
        }),
        new TouchBarButton({
          label: '\u{2754}',
          click: () => { myApp.showHelpWindow(); },
        }),
      ],
    });
    return this._mainTouchBar;
  }

  private _helpTouchBar: Electron.TouchBar = null;
  getHelpTouchBar(): Electron.TouchBar {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    this._helpTouchBar = this._helpTouchBar || new TouchBar({
      items: [
        new TouchBarButton({
          label: 'ヘルプ',
          icon: 'images/icon_32x32@2x.png' as any,
          iconPosition: 'left',
          backgroundColor: '#000000',
        }),
        new TouchBarButton({
          label: '\u{1F50D}',
          click: () => { myApp.helpWindow.webContents.send('shortcut', 'openSearchForm'); },
        }),
        new TouchBarButton({
          label: '\u{2B06}',
          click: () => { myApp.helpWindow.webContents.send('shortcut', 'moveToPreviousHelp'); },
        }),
        new TouchBarButton({
          label: '\u{2B07}',
          click: () => { myApp.helpWindow.webContents.send('shortcut', 'moveToNextHelp'); },
        }),
        new TouchBarButton({
          label: '\u{1F4D6}',
          click: () => { myApp.showDictWindow(); },
        }),
      ],
    });
    return this._helpTouchBar;
  }

  private _dictTouchBar: Electron.TouchBar = null;
  getDictTouchBar(): Electron.TouchBar {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    this._dictTouchBar = this._dictTouchBar || new TouchBar({
      items: [
        new TouchBarButton({
          label: '辞書',
          icon: 'images/icon_32x32@2x.png' as any,
          iconPosition: 'left',
          backgroundColor: '#000000',
        }),
        new TouchBarButton({
          label: '＋',
          click: () => { if (myApp.dictWindow) { myApp.dictWindow.webContents.send('menu', 'add'); } },
        }),
        new TouchBarButton({
          label: 'ー',
          click: () => { if (myApp.dictWindow) { myApp.dictWindow.webContents.send('menu', 'delete'); } },
        }),
        new TouchBarButton({
          label: '編集保存',
          click: () => { if (myApp.dictWindow) { myApp.dictWindow.webContents.send('menu', 'save'); } },
        }),
        new TouchBarButton({
          label: '編集キャンセル',
          click: () => { if (myApp.dictWindow) { myApp.dictWindow.webContents.send('menu', 'cancel'); } },
        }),
        new TouchBarButton({
          label: 'エクスポート',
          click: () => { if (myApp.dictWindow) { myApp.dictWindow.webContents.send('menu', 'export'); } },
        }),
        new TouchBarButton({
          label: '\u{2754}',
          click: () => { myApp.showHelpWindow(); },
        }),
      ],
    });
    return this._dictTouchBar;
  }

  private _minTouchBar: Electron.TouchBar = null;
  getMinimalTouchBar(): Electron.TouchBar {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    this._minTouchBar = this._minTouchBar || new TouchBar({
      items: [
        new TouchBarButton({
          icon: 'images/icon_32x32@2x.png' as any,
          backgroundColor: '#000000',
        }),
        new TouchBarButton({
          label: '\u{1F4D6}',
          click: () => { myApp.showDictWindow(); },
        }),
        new TouchBarButton({
          label: '\u{2754}',
          click: () => { myApp.showHelpWindow(); },
        }),
      ],
    });
    return this._minTouchBar;
  }

}

export default FnTouchBar;
