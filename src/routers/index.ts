import {
  createRouter,
  createWebHashHistory,
  type RouteMeta,
  type RouteLocationRaw
} from 'vue-router';
import { routes } from './route';
import { IPC_CHANNEL } from '@root/shared/dicts/enums';
import { defaultTitle } from '@root/shared/configs/render';

export function getMenuTitle(menu: { meta: RouteMeta }) {
  return typeof menu.meta?.title === 'function'
    ? menu.meta?.title()
    : menu.meta?.title
      ? menu.meta?.title
      : defaultTitle;
}

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.afterEach((to) => {
  document.title = getMenuTitle(to);
});

window.ipcRenderer.on(
  IPC_CHANNEL.CHANGE_ROUTER,
  (_, type: 'push' | 'replace' = 'push', to: RouteLocationRaw) => {
    router[type](to);
  }
);

export default router;
