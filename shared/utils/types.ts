export type ExecuteParams = {
  type: string;
  command: [string, string[]];
};

export type ExecuteResult = {
  type: string;
  output: string | null;
  error: string | null;
  code: number | null;
};

export interface ICreateProjectOptions {
  name: string;
  path: string;
  themeNpmPkg?: string;
}
