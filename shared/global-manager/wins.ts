import { BrowserWindow } from 'electron';
import { GlobalHexo } from './hexo';

export interface IGLMainWin {
  id: string;
  win: BrowserWindow | null;
  hexo: GlobalHexo | null;
}

export class GlobalWindows {
  static ALL_MAIN_WIN: IGLMainWin[] = [];

  #mainWin: IGLMainWin | null = null;

  dialogWin: BrowserWindow | null = null;
  floatWin: BrowserWindow | null = null;
  independentWin: BrowserWindow | null = null;

  get mainWin() {
    return this.#mainWin;
  }

  set mainWin(data: IGLMainWin | null) {
    if (
      data?.id &&
      data.win &&
      data.hexo &&
      !GlobalWindows.ALL_MAIN_WIN.some((e) => e.id === data.id)
    ) {
      GlobalWindows.ALL_MAIN_WIN.push(data);
    } else if (data?.id && data.win === null) {
      const index = GlobalWindows.ALL_MAIN_WIN.findIndex((e) => e.id === data.id);
      if (index >= 0) {
        GlobalWindows.ALL_MAIN_WIN.splice(index, 1);
      }
    }
    this.#mainWin = data;
  }

  constructor() {}

  sendToAllWindows(...options: Parameters<BrowserWindow['webContents']['send']>) {
    GlobalWindows.ALL_MAIN_WIN.forEach((e) => {
      e.win?.webContents.send(...options);
    });
    this.dialogWin?.webContents.send(...options);
    this.floatWin?.webContents.send(...options);
    this.independentWin?.webContents.send(...options);
  }
}

export const GLWins = new GlobalWindows();
