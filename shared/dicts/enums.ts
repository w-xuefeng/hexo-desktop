export enum IPC_CHANNEL {
  STORE_SAVE = 'store-save',
  STORE_GET = 'store-get',
  STORE_GET_SYNC = 'store-get-sync',
  STORE_REMOVE = 'store-remove',
  STORE_CHANGED = 'store-changed',
  CHECK_ENV = 'check-env',
  CHECK_COMMAND_PATH = 'check-command-path',
  CHOOSE_DIRECTORY = 'choose-directory',
  CHOOSE_FILE = 'choose-file',
  IMPORT_PROJECT = 'import-project',
  CREATE_PROJECT = 'create-project',
  OPEN_INDEPENDENT_WINDOW = 'open-independent-window',
  CLOSE_WINDOW = 'close-window',
  CHANGE_ROUTER = 'change-router',
  CREATE_PROJECT_PROGRESS = 'create-project-progress'
}

export enum STORE_KEY {
  LANG = 'lang',
  THEME = 'theme',
  NODE_PATH = 'node-path',
  NPM_PATH = 'npm-path',
  HEXO_PATH = 'hexo-path'
}

export enum STORAGE_KEY {}
