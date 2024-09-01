import { globSync } from 'glob';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import cleanup from 'rollup-plugin-cleanup';
import json from '@rollup/plugin-json';

const entryType = process.env.ENTRY;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const extensions = ['.js', '.json', '.ts'];

const tsPlugin = typescript({
  tsconfig: path.resolve(`./tsconfig.${entryType}.json`),
  declaration: false,
  compilerOptions: {
    types: ['electron']
  }
});

const babelPlugin = babel({
  exclude: 'node_modules/**',
  babelHelpers: 'runtime'
});

export default {
  external: ['electron'],
  plugins: [
    resolve({ extensions }),
    commonjs(),
    json(),
    tsPlugin,
    babelPlugin,
    cleanup({ comments: 'none' })
  ],
  input: globSync(path.join(__dirname, `electron/${entryType}/*.ts`), {
    windowsPathsNoEscape: process.platform === 'win32'
  }),
  output: {
    format: 'es',
    dir: path.join(__dirname, 'dist-electron'),
    entryFileNames: () => `${entryType}/[name].js`
  }
};
