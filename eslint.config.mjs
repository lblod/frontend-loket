import globals from 'globals';
import js from '@eslint/js';

import ember from 'eslint-plugin-ember';
import emberRecommended from 'eslint-plugin-ember/configs/recommended';
import gjsRecommended from 'eslint-plugin-ember/configs/recommended-gjs';

import qunit from 'eslint-plugin-qunit';
import n from 'eslint-plugin-n';

import emberParser from 'ember-eslint-parser';
import babelParser from '@babel/eslint-parser';

const esmParserOptions = {
  ecmaFeatures: { modules: true },
  ecmaVersion: 'latest',
  requireConfigFile: false,
  babelOptions: {
    plugins: [
      ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
    ],
  },
};

// The emberRecommended and gjsRecommended exports are arrays at the moment, so we flatten them to access the rules.
// TODO: remove this once the issues are fixed upstream: https://github.com/ember-cli/ember-cli/pull/10516#discussion_r1805001071
const emberRecommendedRules = flatten(emberRecommended).rules;
const gjsRecommendedRules = flatten(gjsRecommended).rules;

function flatten(configArray) {
  return configArray.reduce((flattened, config) => {
    return {
      ...flattened,
      ...config
    }
  }, {})
}

export default [
  js.configs.recommended,
  {
    name: '.js',
    files: ['**/*.js'],
    languageOptions: {
      parser: babelParser,
      parserOptions: esmParserOptions,
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      ember,
    },
    rules: {
      ...emberRecommendedRules,
      'ember/routes-segments-snake-case': 'off', // https://github.com/ember-cli/eslint-plugin-ember/issues/374
    },
  },
  {
    name: '.gjs',
    files: ['**/*.gjs'],
    languageOptions: {
      parser: emberParser,
      parserOptions: esmParserOptions,
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      ember,
    },
    rules: {
      ...emberRecommendedRules,
      ...gjsRecommendedRules,
    },
  },
  {
    name: 'tests',
    files: ['tests/**/*-test.{js,gjs}'],
    plugins: {
      qunit,
    },
  },
  {
    name: 'cjs node files',
    files: [
      '**/*.cjs',
      'config/**/*.js',
      'testem.js',
      'testem*.js',
      '.prettierrc.js',
      '.stylelintrc.js',
      '.template-lintrc.js',
      'ember-cli-build.js',
    ],
    plugins: {
      n,
    },

    languageOptions: {
      sourceType: 'script',
      ecmaVersion: 'latest',
      globals: {
        ...globals.node,
      },
    },
  },
  {
    name: 'mjs node files',
    files: ['*.mjs'],
    plugins: {
      n,
    },

    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      parserOptions: esmParserOptions,
      globals: {
        ...globals.node,
      },
    },
  },
  /**
   * Settings
   */
  {
    ignores: ['dist/', 'coverage/', '!**/.*'],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  }
];
