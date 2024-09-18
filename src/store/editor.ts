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
import { Message } from '@arco-design/web-vue';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export type TEditorType = 'richText' | 'rawCode';

export const useArticleStore = defineStore('article-store', () => {
  const GLSore = useGLStore();
  const winId = getCurrentWinId();
  const path = ref<string>(SharedStorage.getSession<string>(STORAGE_KEY.CWD) || '');
  const listLoading = ref(false);
  const contentLoading = ref(false);
  const currentArticle = ref<IHexoPostsDetailItem>();
  const monacoEditor = shallowRef<monaco.editor.IStandaloneCodeEditor>();
  const richTextEditor = shallowRef<any>();
  const richTextEditorInitialError = ref(false);
  const editorType = ref<TEditorType>('richText');
  const hexoServerURL = ref<URL | null>(null);
  const contentModified = ref(false);
  const previewInPanel = ref(false);
  const refreshBaseKey = ref(0);
  const previewInPanelFullPath = computed(
    () => `${hexoServerURL.value}${currentArticle.value?.path}`
  );

  const richTextTitle = computed({
    get: () => currentArticle.value?.title,
    set: (value: string) => {
      if (currentArticle.value) {
        currentArticle.value.title = value;
      }
    }
  });

  const unsupportRichTextEditor = computed(() => {
    return (
      ['<style', '<script'].some((e) => currentArticle.value?.raw.includes(e)) ||
      richTextEditorInitialError.value
    );
  });

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
    listLoading.value = true;
    try {
      const rs = await window.ipcRenderer.invoke(IPC_CHANNEL.INIT_HEXO_PROJECT, winId, path.value);
      handleState(rs);
    } finally {
      listLoading.value = false;
      modifyTitle();
    }
  };

  const getContentForInternal = (id: string) => {
    return window.ipcRenderer.invoke(IPC_CHANNEL.GET_HEXO_DOCUMENT, winId, id);
  };

  const getContent = async (id: string) => {
    contentLoading.value = true;
    richTextEditorInitialError.value = false;
    try {
      const rs = await getContentForInternal(id);
      modifyTitle(rs.title);
      currentArticle.value = rs;
    } finally {
      contentLoading.value = false;
    }
  };

  const refreshListForInternal = async (delay: number = 0) => {
    await sleep(delay);
    const rs = await window.ipcRenderer.invoke(IPC_CHANNEL.REFRESH_HEXO_BASE_INFO, winId);
    handleState(rs);
  };

  const refreshList = async () => {
    listLoading.value = true;
    try {
      await refreshListForInternal();
    } finally {
      listLoading.value = false;
    }
  };

  const createArticle = async (options: IHexoPostData) => {
    listLoading.value = true;
    try {
      await window.ipcRenderer.invoke(IPC_CHANNEL.CREATE_HEXO_DOCUMENT, winId, options);
      await refreshListForInternal(1000);
    } finally {
      listLoading.value = false;
    }
  };

  const deleteArticle = async (article: IHexoPostsListItem) => {
    listLoading.value = true;
    try {
      await window.shell.trashItem(article.full_source);
      if (currentArticle.value?.id === article.id) {
        currentArticle.value = void 0;
      }
      await refreshListForInternal(1000);
    } finally {
      listLoading.value = false;
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
    hexoServerURL.value = null;
  };

  const openURLToPreview = (url: string, type: 'local' | 'browser' | 'panel') => {
    const fullPath = `${url}${currentArticle.value?.path}`;
    if (type === 'local') {
      window.open(fullPath);
    } else if (type === 'browser') {
      window.shell.openExternal(fullPath);
    } else if (type === 'panel') {
      previewInPanel.value = true;
    }
  };

  const preview = async (type: 'local' | 'browser' | 'panel') => {
    if (contentModified.value) {
      await exitHexoServer();
    }
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

  const hidePreviewPanel = () => {
    previewInPanel.value = false;
  };

  const exportPreviewPanel = () => {
    previewInPanel.value = false;
    hexoServerURL.value && openURLToPreview(hexoServerURL.value.toString(), 'local');
  };

  const saveRawContent = async () => {
    if (!currentArticle.value) {
      return;
    }
    if (!monacoEditor.value) {
      return;
    }
    const value = monacoEditor.value.getValue();
    if (value === currentArticle.value.raw) {
      return;
    }
    GLSore.startLoading(GLSore.t('editor.saving'));
    try {
      const err = await window.ipcRenderer.invoke(
        IPC_CHANNEL.SAVE_CONTENT_TO_FILE,
        currentArticle.value.full_source,
        value
      );
      if (!err) {
        await refreshListForInternal(1000);
        const rs = await getContentForInternal(currentArticle.value.id);
        currentArticle.value = rs;
        refreshBaseKey.value++;
      }
      Message.success(err ? GLSore.t('editor.saveFail') : GLSore.t('editor.saveDone'));
    } finally {
      GLSore.closeLoading();
    }
  };

  const saveRichTextContent = () => {
    if (!currentArticle.value) {
      return;
    }
    if (!richTextEditor.value) {
      return;
    }
    const html = richTextEditor.value.getHtml();
    if (html === currentArticle.value.content) {
      return;
    }
    const fullPath = currentArticle.value.full_source;
    console.log('article full path', fullPath);
    console.log('richText HTML value', html);
    // TODO handle richtext and save to file
  };

  return {
    path,
    listLoading,
    contentLoading,
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
    hidePreviewPanel,
    exportPreviewPanel,
    saveRawContent,
    saveRichTextContent,
    richTextTitle,
    richTextEditor,
    monacoEditor,
    editorType,
    richTextEditorInitialError,
    hexoServerURL,
    previewInPanel,
    previewInPanelFullPath,
    unsupportRichTextEditor,
    refreshBaseKey
  };
});
