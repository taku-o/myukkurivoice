'use strict';
import {TouchBar} from 'electron';
const {TouchBarButton} = TouchBar;
var _path: any, path = () => { _path = _path || require('path'); return _path; };

class FnTouchBar implements yubo.FnTouchBar {
  constructor() {}

  getMainTouchBar(win: Electron.BrowserWindow): Electron.TouchBar {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    const touchBar = new TouchBar({
      items: [
        new TouchBarButton({
          icon: path().join(__dirname, 'images/icon_32x32@2x.png') as any,
          backgroundColor: '#000000',
          click: () => { win.minimize(); },
        }),
        new TouchBarButton({
          label: '\u{25B6}',
          click: () => { win.webContents.send('shortcut', 'play'); },
        }),
        new TouchBarButton({
          label: '\u{25A0}',
          click: () => { win.webContents.send('shortcut', 'stop'); },
        }),
        new TouchBarButton({
          label: '\u{25CF}',
          click: () => { win.webContents.send('shortcut', 'record'); },
        }),
        new TouchBarButton({
          label: '音記号列変換',
          click: () => { win.webContents.send('shortcut', 'encode'); },
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
    return touchBar;
  }

  getHelpTouchBar(win: Electron.BrowserWindow): Electron.TouchBar {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    const touchBar = new TouchBar({
      items: [
        new TouchBarButton({
          label: 'ヘルプ',
          icon: path().join(__dirname, 'images/icon_32x32@2x.png') as any,
          iconPosition: 'left',
          backgroundColor: '#000000',
          click: () => { win.minimize(); },
        }),
        new TouchBarButton({
          label: '\u{1F50D}',
          click: () => { win.webContents.send('shortcut', 'openSearchForm'); },
        }),
        new TouchBarButton({
          label: '\u{2B06}',
          click: () => { win.webContents.send('shortcut', 'moveToPreviousHelp'); },
        }),
        new TouchBarButton({
          label: '\u{2B07}',
          click: () => { win.webContents.send('shortcut', 'moveToNextHelp'); },
        }),
        new TouchBarButton({
          label: '\u{1F4D6}',
          click: () => { myApp.showDictWindow(); },
        }),
        new TouchBarButton({
          label: '\u{2716}',
          click: () => { win.close(); },
        }),
      ],
    });
    return touchBar;
  }

  getDictTouchBar(win: Electron.BrowserWindow): Electron.TouchBar {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    const touchBar = new TouchBar({
      items: [
        new TouchBarButton({
          label: '辞書',
          icon: path().join(__dirname, 'images/icon_32x32@2x.png') as any,
          iconPosition: 'left',
          backgroundColor: '#000000',
          click: () => { win.minimize(); },
        }),
        new TouchBarButton({
          label: '＋',
          click: () => { win.webContents.send('menu', 'add'); },
        }),
        new TouchBarButton({
          label: 'ー',
          click: () => { win.webContents.send('menu', 'delete'); },
        }),
        new TouchBarButton({
          label: 'Save',
          click: () => { win.webContents.send('menu', 'save'); },
        }),
        new TouchBarButton({
          label: 'Cancel',
          click: () => { win.webContents.send('menu', 'cancel'); },
        }),
        new TouchBarButton({
          label: 'Export',
          click: () => { win.webContents.send('menu', 'export'); },
        }),
        new TouchBarButton({
          label: '\u{2754}',
          click: () => { myApp.showHelpWindow(); },
        }),
        new TouchBarButton({
          label: '\u{2716}',
          click: () => { win.close(); },
        }),
      ],
    });
    return touchBar;
  }

  getMinimalCloseExitTouchBar(win: Electron.BrowserWindow): Electron.TouchBar {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    const touchBar = new TouchBar({
      items: [
        new TouchBarButton({
          icon: path().join(__dirname, 'images/icon_32x32@2x.png') as any,
          backgroundColor: '#000000',
          click: () => { win.minimize(); },
        }),
        new TouchBarButton({
          label: '\u{1F4D6}',
          click: () => { myApp.showDictWindow(); },
        }),
        new TouchBarButton({
          label: '\u{2754}',
          click: () => { myApp.showHelpWindow(); },
        }),
        new TouchBarButton({
          label: '\u{2716}',
          click: () => { win.close(); },
        }),
      ],
    });
    return touchBar;
  }

  getMinimalHideExitTouchBar(win: Electron.BrowserWindow): Electron.TouchBar {
    const myApp = ((this as unknown) as yubo.IMYukkuriVoice);
    const touchBar = new TouchBar({
      items: [
        new TouchBarButton({
          icon: path().join(__dirname, 'images/icon_32x32@2x.png') as any,
          backgroundColor: '#000000',
          click: () => { win.minimize(); },
        }),
        new TouchBarButton({
          label: '\u{1F4D6}',
          click: () => { myApp.showDictWindow(); },
        }),
        new TouchBarButton({
          label: '\u{2754}',
          click: () => { myApp.showHelpWindow(); },
        }),
        new TouchBarButton({
          label: '\u{2716}',
          click: () => { win.hide(); },
        }),
      ],
    });
    return touchBar;
  }

}

export default FnTouchBar;
