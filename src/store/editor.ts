import { IPC_CHANNEL } from '@root/shared/dicts/enums';
import type {
  IHexoPostData,
  IHexoPostsDetailItem,
  IHexoProjectBaseInfo
} from '@root/shared/utils/types';
import { defineStore } from 'pinia';
import { getCurrentWinId } from '@root/shared/render-utils/win-id';
import { PlatformInfo } from '@root/shared/render-utils/storage';
import { defaultTitle } from '@root/shared/configs/render';

export const useArticleStore = defineStore('article-store', () => {
  const winId = getCurrentWinId();
  const path = ref<string>();
  const loading = ref(false);
  const currentArticle = ref<IHexoPostsDetailItem>();
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

  const modifyTitle = () => {
    if (!path.value) {
      return;
    }
    const projectName = path.value.split(PlatformInfo.get('sep')).at(-1);
    if (!projectName) {
      return;
    }
    document.title = `${projectName} - ${defaultTitle}`;
  };

  const init = async () => {
    if (!path.value) {
      return;
    }
    loading.value = true;
    try {
      const rs = await window.ipcRenderer.invoke(IPC_CHANNEL.INIT_HEXO_PROJECT, winId, path.value);
      Object.keys(rs).forEach((k) => {
        state[k as keyof IHexoProjectBaseInfo] = rs[k];
      });
    } finally {
      loading.value = false;
      modifyTitle();
    }
  };

  const getContent = async (id: string) => {
    loading.value = true;
    try {
      const rs = await window.ipcRenderer.invoke(IPC_CHANNEL.GET_HEXO_DOCUMENT, winId, id);
      currentArticle.value = rs;
    } finally {
      loading.value = false;
    }
  };

  const createArticle = async (options: IHexoPostData) => {
    loading.value = true;
    try {
      const rs = await window.ipcRenderer.invoke(IPC_CHANNEL.CREATE_HEXO_DOCUMENT, winId, options);
      console.log('data', rs);
    } finally {
      loading.value = false;
    }
  };

  return {
    path,
    loading,
    state,
    currentArticle,
    init,
    getContent,
    createArticle
  };
});
