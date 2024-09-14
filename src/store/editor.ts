import { IPC_CHANNEL, STORAGE_KEY } from '@root/shared/dicts/enums';
import type {
  IHexoPostData,
  IHexoPostsDetailItem,
  IHexoPostsListItem,
  IHexoProjectBaseInfo
} from '@root/shared/utils/types';
import { defineStore } from 'pinia';
import { getCurrentWinId } from '@root/shared/render-utils/win-id';
import { PlatformInfo, SharedStorage } from '@root/shared/render-utils/storage';
import { sleep } from '@root/shared/utils';
import { useGLStore } from '@/store/global';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export type TEditorType = 'richText' | 'rawCode';

export const useArticleStore = defineStore('article-store', () => {
  const GLSore = useGLStore();
  const winId = getCurrentWinId();
  const path = ref<string>(SharedStorage.getSession<string>(STORAGE_KEY.CWD) || '');
  const loading = ref(false);
  const currentArticle = ref<IHexoPostsDetailItem>();
  const monacoEditor = shallowRef<monaco.editor.IStandaloneCodeEditor>();
  const richTextEditor = shallowRef<any>();
  const richTextEditorInitialError = ref(false);
  const editorType = ref<TEditorType>('richText');
  const hexoServerURL = ref<URL | null>(null);
  const state = reactive<IHexoProjectBaseInfo>({
    posts: {
      length: 0,
      data: []
    },
    pages: {
      length: 0,
      data: []
    },
    categories: {
      length: 0,
      data: []
    },
    tags: {
      length: 0,
      data: []
    },
    data: {}
  });

  const modifyTitle = (current: string | undefined = currentArticle.value?.title) => {
    if (!path.value) {
      return;
    }
    const projectName = path.value.split(PlatformInfo.get('sep')).at(-1);
    if (!projectName) {
      return;
    }
    document.title = `${current ? `${current} - ` : ''}${projectName}`;
  };

  const setPath = (value: string) => {
    path.value = value;
    SharedStorage.setSession(STORAGE_KEY.CWD, value);
  };

  const handleState = (rs?: Record<string, any>) => {
    if (!rs) {
      return;
    }
    Object.keys(rs).forEach((k) => {
      state[k as keyof IHexoProjectBaseInfo] = rs[k];
    });
  };

  const init = async () => {
    if (!path.value) {
      return;
    }
    loading.value = true;
    try {
      const rs = await window.ipcRenderer.invoke(IPC_CHANNEL.INIT_HEXO_PROJECT, winId, path.value);
      handleState(rs);
    } finally {
      loading.value = false;
      modifyTitle();
    }
  };

  const getContent = async (id: string) => {
    loading.value = true;
    richTextEditorInitialError.value = false;
    try {
      const rs = await window.ipcRenderer.invoke(IPC_CHANNEL.GET_HEXO_DOCUMENT, winId, id);
      modifyTitle(rs.title);
      currentArticle.value = rs;
    } finally {
      loading.value = false;
    }
  };

  const refreshListForInternal = async (delay: number = 0) => {
    await sleep(delay);
    const rs = await window.ipcRenderer.invoke(IPC_CHANNEL.REFRESH_HEXO_BASE_INFO, winId);
    handleState(rs);
  };

  const refreshList = async () => {
    loading.value = true;
    try {
      await refreshListForInternal();
    } finally {
      loading.value = false;
    }
  };

  const createArticle = async (options: IHexoPostData) => {
    loading.value = true;
    try {
      await window.ipcRenderer.invoke(IPC_CHANNEL.CREATE_HEXO_DOCUMENT, winId, options);
      await refreshListForInternal(1000);
    } finally {
      loading.value = false;
    }
  };

  const deleteArticle = async (article: IHexoPostsListItem) => {
    loading.value = true;
    try {
      await window.shell.trashItem(article.full_source);
      if (currentArticle.value?.id === article.id) {
        currentArticle.value = void 0;
      }
      await refreshListForInternal(1000);
    } finally {
      loading.value = false;
    }
  };

  const serverHexo = async () => {
    if (hexoServerURL.value) {
      return;
    }
    const port = await window.ipcRenderer.invoke(IPC_CHANNEL.SERVER_HEXO, winId);
    hexoServerURL.value = new URL(`http://localhost:${port}`);
  };

  const exitHexoServer = async () => {
    await window.ipcRenderer.invoke(IPC_CHANNEL.EXIT_SERVER_HEXO, winId);
  };

  const openURLToPreview = (url: string, type: 'local' | 'browser') => {
    const fullPath = `${url}${currentArticle.value?.path}`;
    if (type === 'local') {
      window.open(fullPath);
    } else if (type === 'browser') {
      window.shell.openExternal(fullPath);
    }
  };

  const preview = (type: 'local' | 'browser') => {
    if (hexoServerURL.value) {
      const url = hexoServerURL.value.toString();
      openURLToPreview(url, type);
      return;
    }
    GLSore.loading = true;
    serverHexo()
      .then(() => {
        if (hexoServerURL.value) {
          const url = hexoServerURL.value.toString();
          openURLToPreview(url, type);
          return;
        }
      })
      .finally(() => {
        GLSore.loading = false;
      });
  };

  return {
    path,
    loading,
    state,
    currentArticle,
    init,
    setPath,
    getContent,
    createArticle,
    modifyTitle,
    refreshList,
    deleteArticle,
    serverHexo,
    exitHexoServer,
    preview,
    richTextEditor,
    monacoEditor,
    editorType,
    richTextEditorInitialError
  };
});
