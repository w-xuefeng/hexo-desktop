import { IconArchive, IconApps, IconSettings } from '@arco-design/web-vue/es/icon';
import { useSharedLocales } from '@/locales';

const { t } = useSharedLocales();

export const menus = [
  {
    path: '/main/article-list',
    name: 'main-editor-article-list',
    component: () => import('@/pages/editor/article.vue'),
    meta: {
      title: () => t('menus.articleList'),
      icon: IconArchive
    }
  },
  {
    path: '/main/project-config',
    name: 'main-editor-project-config',
    component: () => import('@/pages/config/project.vue'),
    meta: {
      title: () => t('menus.projectConfig'),
      icon: IconApps
    }
  },
  {
    path: '/main/theme-config',
    name: 'main-editor-theme-config',
    component: () => import('@/pages/config/theme.vue'),
    meta: {
      title: () => t('menus.themeConfig'),
      icon: IconSettings
    }
  }
];
