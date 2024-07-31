import { createApp } from 'vue';
import App from './App.vue';
import router from './routers';
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import './style.less';

createApp(App)
  .use(router)
  .use(ArcoVue)
  .mount('#app')
  .$nextTick(() => {
    // Use contextBridge
    window.ipcRenderer.on('main-process-message', (_event, message) => {
      console.log(message);
    });
  });
