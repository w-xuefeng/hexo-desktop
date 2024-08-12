import { createApp } from 'vue';
import App from './App.vue';
import router from './routers';
import ArcoVue from '@arco-design/web-vue';
import sharedI18n from './locales';
import '@arco-design/web-vue/dist/arco.css';
import './style.less';

createApp(App)
  .use(router)
  .use(sharedI18n)
  .use(ArcoVue)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*');
    window.ipcRenderer.on('main-process-message', (_event, message) => {
      console.log(message);
    });
  });
