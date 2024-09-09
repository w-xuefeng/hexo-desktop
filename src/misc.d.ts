/// <reference types="vue-router" />
/// <reference types="vue-i18n" />

declare module 'vue-router' {
  interface RouteMeta extends Record<string, any> {
    title?: string | (() => string);
    icon?: any;
  }
}
