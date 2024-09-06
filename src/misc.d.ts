import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta extends Record<string, any> {
    title?: string | (() => string);
    icon?: any;
  }
}
