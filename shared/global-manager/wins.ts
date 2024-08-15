import { BrowserWindow } from 'electron';

export class GlobalWindows {
  constructor() {}
  mainWin: BrowserWindow | null = null;
  dialogWin: BrowserWindow | null = null;
  floatWin: BrowserWindow | null = null;
  independentWin: BrowserWindow | null = null;

  sendToAllWindows(...options: Parameters<BrowserWindow['webContents']['send']>) {
    this.mainWin?.webContents.send(...options);
    this.dialogWin?.webContents.send(...options);
    this.floatWin?.webContents.send(...options);
    this.independentWin?.webContents.send(...options);
  }
}

export const GLWins = new GlobalWindows();
