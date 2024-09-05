import path from 'node:path';
import { useI18n } from '../../shared/service-utils';
import { app } from 'electron';

export default function setUserTasks() {
  if (process.platform === 'win32') {
    const { t } = useI18n();
    app.setUserTasks([
      {
        program: process.execPath,
        arguments: [path.join(process.env.MAIN_DIST, 'main.js'), '--no-sandbox'].join(' '),
        iconPath: process.execPath,
        iconIndex: 0,
        title: t('app.newWindow'),
        description: t('app.createWindow')
      }
    ]);
  }
}
