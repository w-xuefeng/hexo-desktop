import { app, BrowserWindow, Menu } from 'electron';
import { GLStore } from '../../shared/global-manager/stores';
import { createMainWindow } from '../window/main-win';
import { buildDockMenu, setUserTasks } from './tasks';
import buildAppMenu from '../menus';
import initIPCEvent from './icp';

function onAppReady() {
  Menu.setApplicationMenu(buildAppMenu());
  if (process.platform === 'darwin') {
    app.dock.setMenu(buildDockMenu());
  }
}

export function initApp() {
  initIPCEvent(GLStore);
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
    .then(onAppReady)
    .then(() => createMainWindow());
}
