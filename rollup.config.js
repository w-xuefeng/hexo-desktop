import { globSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import cleanup from 'rollup-plugin-cleanup';
import json from '@rollup/plugin-json';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const extensions = ['.js', '.json', '.ts'];

const tsPlugin = typescript({
  tsconfig: path.resolve('./tsconfig.scripts.json'),
  declaration: false
});

const babelPlugin = babel({
  exclude: 'node_modules/**',
  babelHelpers: 'runtime'
});

export default {
  plugins: [
    resolve({ extensions }),
    commonjs(),
    json(),
    tsPlugin,
    babelPlugin,
    cleanup({ comments: 'none' })
  ],
  input: globSync(path.join(__dirname, 'electron/scripts/*.ts')),
  output: {
    dir: path.join(__dirname, 'dist-electron'),
    format: 'es',
    entryFileNames: () => `scripts/[name].js`
  }
};
