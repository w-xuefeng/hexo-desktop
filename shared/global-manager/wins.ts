import { randomUUID } from 'crypto';
import { BrowserWindow } from 'electron';

export class GlobalWindows {
  static ALL_MAIN_WIN: { id: string; win: BrowserWindow }[] = [];

  #id = randomUUID().toString();
  #mainWin: BrowserWindow | null = null;

  dialogWin: BrowserWindow | null = null;
  floatWin: BrowserWindow | null = null;
  independentWin: BrowserWindow | null = null;

  get mainWin() {
    return this.#mainWin;
  }

  set mainWin(win: BrowserWindow | null) {
    if (win) {
      GlobalWindows.ALL_MAIN_WIN.push({
        win,
        id: this.#id
      });
    } else if (win === null) {
      const index = GlobalWindows.ALL_MAIN_WIN.findIndex((e) => e.id === this.#id);
      if (index >= 0) {
        GlobalWindows.ALL_MAIN_WIN.splice(index, 1);
      }
    }
    this.#mainWin = win;
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
