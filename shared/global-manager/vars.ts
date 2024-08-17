import path from 'node:path';
import { fileURLToPath } from 'node:url';

// const require = createRequire(import.meta.url);
// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const APP_ROOT = path.join(__dirname, '..');

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

export const MAIN_DIST = path.join(APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(APP_ROOT, 'dist');

export const VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(APP_ROOT, 'public') : RENDERER_DIST;

export function initProcessEnv() {
  process.env.APP_ROOT = APP_ROOT;
  process.env.MAIN_DIST = MAIN_DIST;
  process.env.RENDERER_DIST = RENDERER_DIST;
  process.env.VITE_PUBLIC = VITE_PUBLIC;
}

export const GLIPCEventHandled = {
  current: false
};
