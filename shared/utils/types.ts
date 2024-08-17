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
