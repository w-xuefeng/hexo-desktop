import { app, BrowserWindow } from 'electron';
import { GLWins } from '../../shared/global-manager/wins';
import { createMainWindow } from '../window/main-win';

export function initApp() {
  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
      GLWins.mainWin = null;
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });

  app.whenReady().then(createMainWindow);
}
