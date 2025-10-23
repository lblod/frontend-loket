'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = async function (defaults) {
  const { setConfig } = await import('@warp-drive/build-config');

  const app = new EmberApp(defaults, {
    // This is needed when `staticEmberSource` is enabled
    'ember-fetch': {
      preferNative: true,
      nativePromise: true,
    },
    'ember-simple-auth': {
      useSessionSetupMethod: true,
    },
    'ember-test-selectors': {
      strip: false,
    },
    '@appuniversum/ember-appuniversum': {
      dutchDatePickerLocalization: true,
      disableWormholeElement: true,
    },
    'ember-cli-babel': { enableTypeScriptTransform: true },
  });

  setConfig(app, __dirname, {
    deprecations: {
      DEPRECATE_STORE_EXTENDS_EMBER_OBJECT: false,
    },
  });

  const { Webpack } = require('@embroider/webpack');
  return require('@embroider/compat').compatBuild(app, Webpack, {
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
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
    staticInvokables: true,
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
  });
};
