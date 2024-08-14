export enum IPC_CHANNEL {
  STORE_SAVE = 'store-save',
  STORE_GET = 'store-get',
  STORE_GET_REPLY = 'store-get-reply',
  STORE_REMOVE = 'store-remove',
  CHECK_ENV = 'check-env',
  CHOOSE_DIRECTORY = 'choose-directory',
  IMPORT_PROJECT = 'import-project',
  CREATE_PROJECT = 'create-project',
  OPEN_CREATE_PROJECT = 'open-create-project-panel'
}

export enum STORE_KEY {
  PATH = 'path'
}

export enum STORAGE_KEY {
  LANG = 'lang',
  THEME = 'theme'
}
