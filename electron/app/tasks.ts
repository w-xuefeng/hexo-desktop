import path from 'node:path';
import { useI18n } from '../../shared/service-utils';
import { app, Menu } from 'electron';
import { createMainWindow } from '../window/main-win';

export function createDockMenusOrTask() {
  const { t } = useI18n();
  return [
    {
      title: t('app.newWindow'),
      description: t('app.createWindow'),
      windowsArgs: {
        program: process.execPath,
        arguments: [path.join(process.env.MAIN_DIST, 'main.js'), '--no-sandbox'].join(' '),
        iconPath: process.execPath,
        iconIndex: 0
      },
      macArgs: {
        click: () => {
          createMainWindow();
        }
      }
    }
  ];
}

export function setUserTasks() {
  if (process.platform !== 'win32') {
    return;
  }
  app.setUserTasks(
    createDockMenusOrTask().map((e) => ({
      title: e.title,
      description: e.description,
      ...e.windowsArgs
    }))
  );
}

export function buildDockMenu() {
  if (process.platform !== 'darwin') {
    return Menu.buildFromTemplate([]);
  }
  return Menu.buildFromTemplate(
    createDockMenusOrTask().map((e) => ({
      label: e.title,
      toolTip: e.description,
      ...e.macArgs
    }))
  );
}
