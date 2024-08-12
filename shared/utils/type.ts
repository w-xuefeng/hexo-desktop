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
