import { useI18n } from '../../shared/service-utils';
import { app } from 'electron';

export default function setUserTasks() {
  if (process.platform === 'win32') {
    const { t } = useI18n();
    app.setUserTasks([
      {
        program: process.execPath,
        arguments: '--new-window',
        iconPath: process.execPath,
        iconIndex: 0,
        title: t('app.newWindow'),
        description: t('app.createWindow')
      }
    ]);
  }
}
