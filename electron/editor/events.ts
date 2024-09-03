import { ipcMain } from 'electron';
import { IPC_CHANNEL } from '../../shared/dicts/enums';
import { initHexoEditor } from '../services/project/project-editor/init';
import { getDocument } from '../services/project/project-editor/document';

export default function initIPCEditorEvent() {
  ipcMain.handle(IPC_CHANNEL.INIT_HEXO_PROJECT, (_, cwd: string, options?: Record<string, any>) => {
    return initHexoEditor(cwd, options);
  });
  ipcMain.handle(IPC_CHANNEL.GET_HEXO_DOCUMENT, (_, id: string) => {
    return getDocument(id);
  });
}
