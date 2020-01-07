'use strict';
var _localShortcut: any, localShortcut = () => { _localShortcut = _localShortcut || require('electron-localshortcut'); return _localShortcut; };

class FnShortcut implements yubo.FnShortcut {
  constructor() {}

  registerMainShortcut(win: Electron.BrowserWindow): void {
    localShortcut().register(win, 'Command+P', () => {
      win.webContents.send('shortcut', 'play');
    });
    localShortcut().register(win, 'Command+W', () => {
      win.webContents.send('shortcut', 'stop');
    });
    localShortcut().register(win, 'Command+S', () => {
      win.webContents.send('shortcut', 'record');
    });
    localShortcut().register(win, 'Command+Up', () => {
      win.webContents.send('shortcut', 'moveToSource');
    });
    localShortcut().register(win, 'Command+Down', () => {
      win.webContents.send('shortcut', 'moveToEncoded');
    });
    localShortcut().register(win, 'Command+Right', () => {
      win.webContents.send('shortcut', 'encode');
    });
    localShortcut().register(win, 'Command+D', () => {
      win.webContents.send('shortcut', 'fromClipboard');
    });
    localShortcut().register(win, 'Command+N', () => {
      win.webContents.send('shortcut', 'putVoiceName');
    });
    localShortcut().register(win, 'Command+Left', () => {
      win.webContents.send('shortcut', 'swichNextConfig');
    });
    localShortcut().register(win, 'Command+Shift+Left', () => {
      win.webContents.send('shortcut', 'swichPreviousConfig');
    });

    localShortcut().register(win, 'Command+0', () => {
      win.webContents.send('shortcut', 'swichNumberConfig', 0);
    });
    localShortcut().register(win, 'Command+1', () => {
      win.webContents.send('shortcut', 'swichNumberConfig', 1);
    });
    localShortcut().register(win, 'Command+2', () => {
      win.webContents.send('shortcut', 'swichNumberConfig', 2);
    });
    localShortcut().register(win, 'Command+3', () => {
      win.webContents.send('shortcut', 'swichNumberConfig', 3);
    });
    localShortcut().register(win, 'Command+4', () => {
      win.webContents.send('shortcut', 'swichNumberConfig', 4);
    });
    localShortcut().register(win, 'Command+5', () => {
      win.webContents.send('shortcut', 'swichNumberConfig', 5);
    });
    localShortcut().register(win, 'Command+6', () => {
      win.webContents.send('shortcut', 'swichNumberConfig', 6);
    });
    localShortcut().register(win, 'Command+7', () => {
      win.webContents.send('shortcut', 'swichNumberConfig', 7);
    });
    localShortcut().register(win, 'Command+8', () => {
      win.webContents.send('shortcut', 'swichNumberConfig', 8);
    });
    localShortcut().register(win, 'Command+9', () => {
      win.webContents.send('shortcut', 'swichNumberConfig', 9);
    });
  }

  registerHelpShortcut(win: Electron.BrowserWindow): void {
    localShortcut().register(win, 'Command+W', () => {
      win.close();
    });
    localShortcut().register(win, 'Up', () => {
      win.webContents.send('shortcut', 'moveToPreviousHelp');
    });
    localShortcut().register(win, 'Down', () => {
      win.webContents.send('shortcut', 'moveToNextHelp');
    });
    localShortcut().register(win, 'Command+Left', () => {
      win.webContents.goBack();
    });
    localShortcut().register(win, 'Command+Right', () => {
      win.webContents.goForward();
    });
    localShortcut().register(win, 'Command+F', () => {
      win.webContents.send('shortcut', 'openSearchForm');
    });
  }

  registerHelpSearchShortcut(win: Electron.BrowserWindow): void {
    localShortcut().register(win, 'Command+W', () => {
      win.hide();
    });
  }

  registerSystemShortcut(win: Electron.BrowserWindow): void {
    localShortcut().register(win, 'Command+W', () => {
      win.close();
    });
  }

  registerDictShortcut(win: Electron.BrowserWindow): void {
    localShortcut().register(win, 'Command+W', () => {
      win.close();
    });
    localShortcut().register(win, 'Command+S', () => {
      win.webContents.send('shortcut', 'save');
    });
    localShortcut().register(win, 'Command+N', () => {
      win.webContents.send('shortcut', 'add');
    });
  }

  registerAboutShortcut(win: Electron.BrowserWindow): void {
    localShortcut().register(win, 'Command+W', () => {
      win.close();
    });
  }

}

export default FnShortcut;
