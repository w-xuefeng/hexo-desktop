export enum IPC_CHANNEL {
  STORE_SAVE = 'store-save',
  STORE_GET = 'store-get',
  STORE_GET_SYNC = 'store-get-sync',
  STORE_REMOVE = 'store-remove',
  STORE_CHANGED = 'store-changed',
  CHECK_ENV = 'check-env',
  CHOOSE_DIRECTORY = 'choose-directory',
  IMPORT_PROJECT = 'import-project',
  CREATE_PROJECT = 'create-project',
  OPEN_CREATE_PROJECT = 'open-create-project-panel',
  CLOSE_WINDOW = 'close-window',
  CHANGE_ROUTER = 'change-router',
  CREATE_PROJECT_PROGRESS = 'create-project-progress'
}

export enum STORE_KEY {
  LANG = 'lang',
  THEME = 'theme'
}

export enum STORAGE_KEY {}
