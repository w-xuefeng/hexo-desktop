import { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/welcome'
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: () => import('@/pages/welcome/index.vue')
  },
  {
    path: '/main',
    name: 'main',
    meta: {
      authorized: []
    },
    component: () => import('@/layout/layout-page.vue'),
    redirect: '/main/editor',
    children: [
      {
        path: '/main/editor',
        name: 'main-editor',
        component: () => import('@/pages/editor/index.vue')
      }
    ]
  },
  {
    path: '/create-project-panel',
    name: 'create-project-panel',
    component: () => import('@/pages/create-project/index.vue')
  },
  {
    path: '/404/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/404/index.vue'),
    meta: {
      invisible: true
    }
  }
];
