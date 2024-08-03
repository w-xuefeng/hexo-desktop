import js from '@eslint/js';
import eslintPluginVue from 'eslint-plugin-vue';
import ts from 'typescript-eslint';

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...eslintPluginVue.configs['flat/recommended'],
  {
    files: ['*.vue', '**/*.vue', '*.ts', '**/*.ts'],
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    },
    rules: {
      semi: 'error',
      'vue/multi-word-component-names': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  {
    ignores: [
      'dist-electron',
      'res',
      'node_modules',
      'dist',
      'public',
      '**/*/lib',
      'auto-imports.d.ts',
      '.yarn'
    ]
  }
);
