import { SlateDescendant } from '@wangeditor/editor';
import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta extends Record<string, any> {
    title?: string | (() => string);
    icon?: any;
  }
}

declare module '@wangeditor/editor' {
  interface SlateText {
    text: string;
  }

  interface SlateElement {
    type: string;
    children: SlateDescendant[];
  }
}
