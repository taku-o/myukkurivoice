'use strict';
var _localShortcut: any, localShortcut = () => { _localShortcut = _localShortcut || require('electron-localshortcut'); return _localShortcut; };

class FnShortcut implements yubo.FnShortcut {
  constructor() {}

  registerMainWindowShortcut(mainWindow: Electron.BrowserWindow): void {
    localShortcut().register(mainWindow, 'Command+P', () => {
      mainWindow.webContents.send('shortcut', 'play');
    });
    localShortcut().register(mainWindow, 'Command+W', () => {
      mainWindow.webContents.send('shortcut', 'stop');
    });
    localShortcut().register(mainWindow, 'Command+S', () => {
      mainWindow.webContents.send('shortcut', 'record');
    });
    localShortcut().register(mainWindow, 'Command+Up', () => {
      mainWindow.webContents.send('shortcut', 'moveToSource');
    });
    localShortcut().register(mainWindow, 'Command+Down', () => {
      mainWindow.webContents.send('shortcut', 'moveToEncoded');
    });
    localShortcut().register(mainWindow, 'Command+Right', () => {
      mainWindow.webContents.send('shortcut', 'encode');
    });
    localShortcut().register(mainWindow, 'Command+D', () => {
      mainWindow.webContents.send('shortcut', 'fromClipboard');
    });
    localShortcut().register(mainWindow, 'Command+N', () => {
      mainWindow.webContents.send('shortcut', 'putVoiceName');
    });
    localShortcut().register(mainWindow, 'Command+Left', () => {
      mainWindow.webContents.send('shortcut', 'swichNextConfig');
    });
    localShortcut().register(mainWindow, 'Command+Shift+Left', () => {
      mainWindow.webContents.send('shortcut', 'swichPreviousConfig');
    });

    localShortcut().register(mainWindow, 'Command+0', () => {
      mainWindow.webContents.send('shortcut', 'swichNumberConfig', 0);
    });
    localShortcut().register(mainWindow, 'Command+1', () => {
      mainWindow.webContents.send('shortcut', 'swichNumberConfig', 1);
    });
    localShortcut().register(mainWindow, 'Command+2', () => {
      mainWindow.webContents.send('shortcut', 'swichNumberConfig', 2);
    });
    localShortcut().register(mainWindow, 'Command+3', () => {
      mainWindow.webContents.send('shortcut', 'swichNumberConfig', 3);
    });
    localShortcut().register(mainWindow, 'Command+4', () => {
      mainWindow.webContents.send('shortcut', 'swichNumberConfig', 4);
    });
    localShortcut().register(mainWindow, 'Command+5', () => {
      mainWindow.webContents.send('shortcut', 'swichNumberConfig', 5);
    });
    localShortcut().register(mainWindow, 'Command+6', () => {
      mainWindow.webContents.send('shortcut', 'swichNumberConfig', 6);
    });
    localShortcut().register(mainWindow, 'Command+7', () => {
      mainWindow.webContents.send('shortcut', 'swichNumberConfig', 7);
    });
    localShortcut().register(mainWindow, 'Command+8', () => {
      mainWindow.webContents.send('shortcut', 'swichNumberConfig', 8);
    });
    localShortcut().register(mainWindow, 'Command+9', () => {
      mainWindow.webContents.send('shortcut', 'swichNumberConfig', 9);
    });
  }

  registerHelpWindowShortcut(helpWindow: Electron.BrowserWindow): void {
    localShortcut().register(helpWindow, 'Command+W', () => {
      if (helpWindow) { helpWindow.close(); }
    });
    localShortcut().register(helpWindow, 'Up', () => {
      helpWindow.webContents.send('shortcut', 'moveToPreviousHelp');
    });
    localShortcut().register(helpWindow, 'Down', () => {
      helpWindow.webContents.send('shortcut', 'moveToNextHelp');
    });
    localShortcut().register(helpWindow, 'Command+Left', () => {
      helpWindow.webContents.goBack();
    });
    localShortcut().register(helpWindow, 'Command+Right', () => {
      helpWindow.webContents.goForward();
    });
    localShortcut().register(helpWindow, 'Command+F', () => {
      helpWindow.webContents.send('shortcut', 'openSearchForm');
    });
  }

  registerHelpSearchDialogShortcut(helpSearchDialog: Electron.BrowserWindow): void {
    localShortcut().register(helpSearchDialog, 'Command+W', () => {
      if (helpSearchDialog) { helpSearchDialog.hide(); }
    });
  }

  registerSystemWindowShortcut(systemWindow: Electron.BrowserWindow): void {
    localShortcut().register(systemWindow, 'Command+W', () => {
      if (systemWindow) { systemWindow.close(); }
    });
  }

  registerDictWindowShortcut(dictWindow: Electron.BrowserWindow): void {
    localShortcut().register(dictWindow, 'Command+W', () => {
      if (dictWindow) { dictWindow.close(); }
    });
    localShortcut().register(dictWindow, 'Command+S', () => {
      dictWindow.webContents.send('shortcut', 'save');
    });
    localShortcut().register(dictWindow, 'Command+N', () => {
      dictWindow.webContents.send('shortcut', 'add');
    });
  }

  registerAboutWindowShortcut(aboutWindow: Electron.BrowserWindow): void {
    localShortcut().register(aboutWindow, 'Command+W', () => {
      if (aboutWindow) { aboutWindow.close(); }
    });
  }
}

export default FnShortcut;
