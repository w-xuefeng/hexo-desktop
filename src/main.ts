import { createApp } from 'vue';
import { IPC_CHANNEL, STORAGE_KEY } from '@root/shared/dicts/enums';
import App from './App.vue';
import router from './routers';
import ArcoVue from '@arco-design/web-vue';
import sharedI18n from './locales';
import { createPinia } from 'pinia';
import { SharedStorage } from '@root/shared/render-utils/storage';
import '@arco-design/web-vue/dist/arco.min.css';
import './style.less';

window.ipcRenderer.on(IPC_CHANNEL.MAIN_PROCESS_START, (_event, winId, time) => {
  console.log(`[MAIN_PROCESS_START]: ${time}`);
  SharedStorage.setSession(STORAGE_KEY.WIN_ID, winId);
});

createApp(App)
  .use(router)
  .use(sharedI18n)
  .use(ArcoVue)
  .use(createPinia())
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*');
  });
