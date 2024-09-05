import { app, BrowserWindow } from 'electron';
import { GLStore } from '../../shared/global-manager/stores';
import { createMainWindow } from '../window/main-win';
import { buildDockMenu, setUserTasks } from './tasks';
import initIPCEvent from './icp';
import setAppMenu from '../menus';

export function initApp() {
  initIPCEvent(GLStore);
  setAppMenu();
  setUserTasks();

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });

  app.on('open-file', (event, path) => {
    event.preventDefault();
    createMainWindow(path);
  });

  app
    .whenReady()
    .then(() => {
      if (process.platform === 'darwin') {
        app.dock.setMenu(buildDockMenu());
      }
    })
    .then(() => createMainWindow());
}
