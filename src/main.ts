import { createApp } from 'vue';
import { IPC_CHANNEL } from '@root/shared/dicts/enums';
import App from './App.vue';
import router from './routers';
import ArcoVue, { Modal } from '@arco-design/web-vue';
import sharedI18n from './locales';
import { createPinia } from 'pinia';
import { setCurrentWinId } from '@root/shared/render-utils/win-id';
import { PlatformInfo } from '@root/shared/render-utils/storage';
import { storeChangeHandler } from './store-change-handler';
import { forbiddenRefresh } from '@root/shared/render-utils';
import '@arco-design/web-vue/dist/arco.min.css';
import './style.less';

function render() {
  forbiddenRefresh();
  const app = createApp(App).use(router).use(sharedI18n).use(ArcoVue).use(createPinia());
  Modal._context = app._context;
  app.mount('#app').$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*');
  });
}

window.ipcRenderer.on(IPC_CHANNEL.MAIN_PROCESS_START, (_event, winId, time, platformInfo) => {
  console.log(`[MAIN_PROCESS_START]: ${time}`);
  setCurrentWinId(winId);
  PlatformInfo.set(platformInfo);
  render();
});

window.ipcRenderer.on(IPC_CHANNEL.INDEPENDENT_WIN_START, (_event, time, platformInfo) => {
  console.log(`[INDEPENDENT_WIN_START]: ${time}`);
  PlatformInfo.set(platformInfo);
  render();
});

window.ipcRenderer.on(IPC_CHANNEL.STORE_CHANGED, (_, store) => {
  storeChangeHandler(store);
});
