import { createApp } from 'vue';
import { IPC_CHANNEL } from '@root/shared/dicts/enums';
import App from './App.vue';
import router from './routers';
import ArcoVue from '@arco-design/web-vue';
import sharedI18n from './locales';
import { createPinia } from 'pinia';
import { setCurrentWinId } from '@root/shared/render-utils/win-id';
import '@arco-design/web-vue/dist/arco.min.css';
import './style.less';

function render() {
  createApp(App)
    .use(router)
    .use(sharedI18n)
    .use(ArcoVue)
    .use(createPinia())
    .mount('#app')
    .$nextTick(() => {
      postMessage({ payload: 'removeLoading' }, '*');
    });
}

window.ipcRenderer.on(IPC_CHANNEL.MAIN_PROCESS_START, (_event, winId, time) => {
  console.log(`[MAIN_PROCESS_START]: ${time}`);
  setCurrentWinId(winId);
  render();
});

window.ipcRenderer.on(IPC_CHANNEL.INDEPENDENT_WIN_START, (_event, time) => {
  console.log(`[INDEPENDENT_WIN_START]: ${time}`);
  render();
});
