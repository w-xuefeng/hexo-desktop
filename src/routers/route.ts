import { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'root',
    meta: {
      authorized: []
    },
    component: () => import('@/layout/layout-page.vue'),
    children: [
      {
        path: '/404/:pathMatch(.*)*',
        name: 'ContentNotFound',
        component: () => import('@/pages/404/index.vue'),
        meta: {
          invisible: true
        }
      }
    ]
  }
];
