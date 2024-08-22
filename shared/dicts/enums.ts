export enum IPC_CHANNEL {
  CHANGE_THEME = 'change-theme',
  STORE_SAVE = 'store-save',
  STORE_GET = 'store-get',
  STORE_GET_SYNC = 'store-get-sync',
  STORE_REMOVE = 'store-remove',
  STORE_CHANGED = 'store-changed',
  CHECK_ENV = 'check-env',
  CHECK_ENV_FROM_OTHERS_PAGE = 'check-env-from-other-page',
  GET_ENV_PATH = 'get-env-path',
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
  ENV_PATH = 'env-path'
}

export enum STORAGE_KEY {}
