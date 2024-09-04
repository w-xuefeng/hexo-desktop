<template>
  <div>
    <a-button @click="createArticle">new</a-button>
    <ul>
      <li v-for="post in state.posts.data" :key="post.id" @click="getContent(post.id)">
        {{ post.title }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useTheme } from '@/store';
import { IPC_CHANNEL } from '@root/shared/dicts/enums';
import type { IHexoProjectBaseInfo } from '@root/shared/utils/types';

useTheme();
const route = useRoute();
const path = ref(route.query.path);
const loading = ref(false);
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

const init = async () => {
  loading.value = true;
  try {
    const rs = await window.ipcRenderer.invoke(IPC_CHANNEL.INIT_HEXO_PROJECT, path.value);
    Object.keys(rs).forEach((k) => {
      state[k as keyof IHexoProjectBaseInfo] = rs[k];
    });
  } finally {
    loading.value = false;
  }
};

const getContent = async (id: string) => {
  loading.value = true;
  try {
    const rs = await window.ipcRenderer.invoke(IPC_CHANNEL.GET_HEXO_DOCUMENT, id);
    console.log('content', rs);
  } finally {
    loading.value = false;
  }
};

const createArticle = async () => {
  // loading.value = true;
  // try {
  //   const rs = await window.ipcRenderer.invoke(IPC_CHANNEL.CREATE_HEXO_DOCUMENT, {
  //     title: 'new article'
  //   });
  //   console.log('data', rs);
  // } finally {
  //   loading.value = false;
  // }
};

init();
</script>

<style scoped lang="less"></style>
