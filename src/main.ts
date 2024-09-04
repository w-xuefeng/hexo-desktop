import { createApp } from 'vue';
import { IPC_CHANNEL } from '@root/shared/dicts/enums';
import App from './App.vue';
import router from './routers';
import ArcoVue from '@arco-design/web-vue';
import sharedI18n from './locales';
import '@arco-design/web-vue/dist/arco.min.css';
import './style.less';

createApp(App)
  .use(router)
  .use(sharedI18n)
  .use(ArcoVue)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*');
    window.ipcRenderer.on(IPC_CHANNEL.MAIN_PROCESS_START, (_event, message) => {
      console.log(message);
    });
  });
