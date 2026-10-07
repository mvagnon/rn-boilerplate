const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const json = require('@eslint/json').default;
const css = require('@eslint/css').default;

module.exports = defineConfig([
  {
    ignores: ['dist/**', '.expo/**', '.rnstorybook/storybook.requires.ts'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    extends: [expoConfig],
  },
  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/json',
    extends: ['json/recommended'],
  },
  {
    files: ['**/*.css'],
    plugins: { css },
    language: 'css/css',
    extends: ['css/recommended'],
  },
]);
