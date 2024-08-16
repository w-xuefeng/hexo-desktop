import { createRouter, createWebHashHistory, type RouteLocationRaw } from 'vue-router';
import { routes } from './route';
import { IPC_CHANNEL } from '@root/shared/dicts/enums';
export const defaultTitle = 'Hexo Desktop';

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.afterEach((to) => {
  document.title =
    typeof to.meta?.title === 'function'
      ? to.meta?.title()
      : to.meta?.title
        ? to.meta?.title
        : defaultTitle;
});

window.ipcRenderer.on(
  IPC_CHANNEL.CHANGE_ROUTER,
  (_, type: 'push' | 'replace' = 'push', to: RouteLocationRaw) => {
    router[type](to);
  }
);

export default router;
