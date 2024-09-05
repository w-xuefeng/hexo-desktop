import { ipcMain } from 'electron';
import { IPC_CHANNEL } from '../../shared/dicts/enums';
import { initHexoEditor } from '../services/project/project-editor/init';
import { createDocument, getDocument } from '../services/project/project-editor/document';
import type { IHexoPostData } from '../../shared/utils/types';

export default function initIPCEditorEvent() {
  ipcMain.handle(
    IPC_CHANNEL.INIT_HEXO_PROJECT,
    (_, winId: string, cwd: string, options?: Record<string, any>) => {
      return initHexoEditor(winId, cwd, options);
    }
  );
  ipcMain.handle(IPC_CHANNEL.GET_HEXO_DOCUMENT, (_, winId: string, id: string) => {
    return getDocument(winId, id);
  });
  ipcMain.handle(
    IPC_CHANNEL.CREATE_HEXO_DOCUMENT,
    (_, winId: string, data: IHexoPostData, replace = true) => {
      return createDocument(winId, data, replace);
    }
  );
}
