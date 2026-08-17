'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { setConfig } = require('@warp-drive/core/build-config');

module.exports = async function (defaults) {
  const app = new EmberApp(defaults, {
    'ember-test-selectors': {
      strip: false,
    },
    '@appuniversum/ember-appuniversum': {
      dutchDatePickerLocalization: true,
      disableWormholeElement: true,
    },
    'ember-cli-babel': { enableTypeScriptTransform: true },
    babel: {
      plugins: [
        // ... any other plugins
        require.resolve('ember-concurrency/async-arrow-task-transform'),

        // NOTE: put any code coverage plugins last, after the transform.
      ],
    },
  });

  setConfig(app, __dirname, {
    deprecations: {
      DEPRECATE_STORE_EXTENDS_EMBER_OBJECT: false,
    },
  });

  setConfig(app, __dirname, {
    // this should be the most recent <major>.<minor> version for
    // which all deprecations have been fully resolved
    // and should be updated when that changes
    // compatWith: '5.8', // TODO: enable this once we resolve all deprecations
    deprecations: {
      // ... list individual deprecations that have been resolved here
    },
  });

  const { Webpack } = require('@embroider/webpack');
  return require('@embroider/compat').compatBuild(app, Webpack, {
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    staticInvokables: true,
    staticEmberSource: true,
    splitAtRoutes: [
      'mock-login',
      'impersonate',
      'contact',
      'legaal',
      'bbcdr',
      'supervision',
      'berichtencentrum',
      'leidinggevendenbeheer',
      'personeelsbeheer',
      'eredienst-mandatenbeheer',
      'worship-ministers-management',
    ],
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
  });
};
