import { BrowserWindow } from 'electron';

export class GlobalWindows {
  constructor() {}
  mainWin: BrowserWindow | null = null;
  dialogWin: BrowserWindow | null = null;
  floatWin: BrowserWindow | null = null;
}

export const GLWins = new GlobalWindows();
