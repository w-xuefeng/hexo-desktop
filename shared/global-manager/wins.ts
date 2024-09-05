import { BrowserWindow } from 'electron';
import { GlobalHexo } from './hexo';

export interface IGLMainWin {
  id: string;
  win: BrowserWindow;
  hexo: GlobalHexo;
}

export class GlobalWindows {
  mainWins: IGLMainWin[] = [];
  dialogWin: BrowserWindow | null = null;
  floatWin: BrowserWindow | null = null;
  independentWin: BrowserWindow | null = null;

  constructor() {}

  sendToAllWindows(...options: Parameters<BrowserWindow['webContents']['send']>) {
    this.mainWins.forEach((e) => {
      e.win.webContents.send(...options);
    });
    this.dialogWin?.webContents.send(...options);
    this.floatWin?.webContents.send(...options);
    this.independentWin?.webContents.send(...options);
  }

  getMainWin(id: string) {
    return this.mainWins.find((e) => e.id === id);
  }

  addMainWin(data: IGLMainWin) {
    if (this.mainWins.some((e) => e.id === data.id)) {
      return;
    }
    this.mainWins.push(data);
  }

  removeMainWin(id: string) {
    const index = this.mainWins.findIndex((e) => e.id === id);
    if (index >= 0) {
      this.mainWins.splice(index, 1);
    }
  }
}

export const GLWins = new GlobalWindows();
