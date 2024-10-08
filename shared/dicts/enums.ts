export enum IPC_CHANNEL {
  MAIN_PROCESS_START = 'main-process-start',
  INDEPENDENT_WIN_START = 'independent-win-start',
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
  IMPORT_PROJECT_BY_DROP = 'import-project-by-drop',
  IMPORT_PROJECT_BY_DROP_REPLY = 'import-project-by-drop-reply',
  CREATE_PROJECT = 'create-project',
  OPEN_INDEPENDENT_WINDOW = 'open-independent-window',
  CLOSE_WINDOW = 'close-window',
  CHANGE_ROUTER = 'change-router',
  CREATE_PROJECT_PROGRESS = 'create-project-progress',
  INIT_HEXO_PROJECT = 'init-hexo-project',
  REFRESH_HEXO_BASE_INFO = 'refresh-hexo-base-info',
  GET_HEXO_DOCUMENT = 'get-hexo-document',
  CREATE_HEXO_DOCUMENT = 'create-hexo-document',
  GL_LOADING = 'global-loading',
  SERVER_HEXO = 'server-hexo',
  EXIT_SERVER_HEXO = 'exit-server-hexo',
  SAVE_CONTENT_TO_FILE = 'save-content-to-file',
  GET_HEXO_CONFIG = 'get-hexo-config'
}

export enum STORE_KEY {
  LANG = 'lang',
  THEME = 'theme',
  ENV_PATH = 'env-path',
  INITIALED = 'initialed'
}

export enum STORAGE_KEY {
  WIN_ID = 'window-id',
  PLATFORM_INFO = 'platform-info',
  CWD = 'cwd',
  ARTICLE_LIST_WIDTH = 'article-list-width'
}

export enum LOADING_CATEGORY {
  NORMAL_LOADING = 'normal-loading',
  INSTALLING = 'installing'
}
