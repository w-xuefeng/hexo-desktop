import type { SpawnOptionsWithoutStdio } from 'node:child_process';

export interface ICommonResponse<T = any> extends Record<string, any> {
  success: boolean;
  message?: string;
  data?: T;
}

export type ExecuteParams = {
  type: string;
  command: [string, string[]];
  options?: SpawnOptionsWithoutStdio;
  onData?(data: string): void;
};

export type ExecuteResult = {
  type: string;
  output: string | null;
  error: string | null;
  code: number | null;
  stderr: string | null;
};

export interface ICreateProjectOptions {
  name: string;
  path: string;
  themeNpmPkg?: string;
  gitRemoteOrigin?: string;
}

export interface IExecutedMessage<T, D> {
  type: T;
  data: D;
}

/**
 * hexo
 */

export interface IHexoMoment extends Record<string, any> {}

export interface IHexoQuery<T = Record<string, any>> {
  data: T[];
  length: number;
}

export interface IHexoDocument extends Record<string, any> {
  _id: string;
  _content: string;
  __post: boolean;
  title: string;
  source: string;
  raw: string;
  slug: string;
  published: boolean;
  date: IHexoMoment;
  updated: IHexoMoment;
  comments: boolean;
  layout: string;
  photos: any[];
  content: string;
  excerpt: string;
  more: string;
  path: string;
  permalink: string;
  full_source: string;
  asset_dir: string;
  tags: IHexoQuery;
  categories: IHexoQuery;
}

export interface IHexoTagsDocument extends Record<string, any> {
  name: string;
  _id: string;
  slug: string;
  path: string;
  permalink: string;
  posts: IHexoQuery<IHexoDocument>;
  length: number;
}

export interface IHexoCategoriesDocument extends Record<string, any> {
  name: string;
  _id: string;
  slug: string;
  path: string;
  permalink: string;
  posts: IHexoQuery<IHexoDocument>;
  length: number;
}

export interface IHexoObject {
  posts: IHexoQuery<IHexoDocument>;
  pages: IHexoQuery<IHexoDocument>;
  categories: IHexoQuery<IHexoCategoriesDocument>;
  tags: IHexoQuery<IHexoTagsDocument>;
  data: Record<string, any>;
}

export interface IHexoProjectBaseInfo {
  posts: {
    length: number;
    data: {
      id: string;
      title: string;
    }[];
  };
  pages: {
    length: number;
    data: {
      id: string;
      title: string;
    }[];
  };
  categories: {
    length: number;
    data: {
      name: string;
      id: string;
    }[];
  };
  tags: {
    length: number;
    data: {
      name: string;
      id: string;
    }[];
  };
  data: Record<string, any>;
}
