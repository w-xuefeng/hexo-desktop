import { createRouter, createWebHashHistory } from 'vue-router';
import { routes } from './route';
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

export default router;
