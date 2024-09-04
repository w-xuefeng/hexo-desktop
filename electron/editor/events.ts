import { ipcMain } from 'electron';
import { IPC_CHANNEL } from '../../shared/dicts/enums';
import { initHexoEditor } from '../services/project/project-editor/init';
import { createDocument, getDocument } from '../services/project/project-editor/document';
import type { IHexoPostData } from '../../shared/utils/types';

export default function initIPCEditorEvent() {
  ipcMain.handle(IPC_CHANNEL.INIT_HEXO_PROJECT, (_, cwd: string, options?: Record<string, any>) => {
    return initHexoEditor(cwd, options);
  });
  ipcMain.handle(IPC_CHANNEL.GET_HEXO_DOCUMENT, (_, id: string) => {
    return getDocument(id);
  });
  ipcMain.handle(IPC_CHANNEL.CREATE_HEXO_DOCUMENT, (_, data: IHexoPostData, replace = true) => {
    return createDocument(data, replace);
  });
}
