import { ipcMain } from 'electron';
import { IPC_CHANNEL } from '../../shared/dicts/enums';
import { initHexoEditor, refreshBaseInfo } from '../services/project/project-editor/init';
import { createDocument, getDocument } from '../services/project/project-editor/document';
import { exitHexoServer, serverHexo } from '../services/project/project-editor/server';
import { saveContentToFile } from '../../shared/service-utils';
import type { IHexoPostData } from '../../shared/utils/types';

export default function initIPCEditorEvent() {
  ipcMain.handle(
    IPC_CHANNEL.INIT_HEXO_PROJECT,
    (_, winId: string, cwd: string, options?: Record<string, any>) => {
      return initHexoEditor(winId, cwd, options);
    }
  );
  ipcMain.handle(IPC_CHANNEL.REFRESH_HEXO_BASE_INFO, (_, winId: string) => {
    return refreshBaseInfo(winId);
  });
  ipcMain.handle(IPC_CHANNEL.GET_HEXO_DOCUMENT, (_, winId: string, id: string) => {
    return getDocument(winId, id);
  });
  ipcMain.handle(
    IPC_CHANNEL.CREATE_HEXO_DOCUMENT,
    (_, winId: string, data: IHexoPostData, replace = true) => {
      return createDocument(winId, data, replace);
    }
  );

  ipcMain.handle(IPC_CHANNEL.SERVER_HEXO, (_, winId: string) => {
    return serverHexo(winId);
  });

  ipcMain.handle(IPC_CHANNEL.EXIT_SERVER_HEXO, (_, winId: string) => {
    return exitHexoServer(winId);
  });

  ipcMain.handle(IPC_CHANNEL.SAVE_CONTENT_TO_FILE, (_, filePath: string, content: string) => {
    return saveContentToFile(filePath, content);
  });
}
