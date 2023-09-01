'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const customBuildConfig = {
    // Add options here
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
    '@embroider/macros': {
      setOwnConfig: {
        controle: process.env.CONTROLE === 'true',
      },
    },
  };

  // console.log(defaults);

  let app = new EmberApp(defaults, customBuildConfig);
  // Uncomment this if you want a "classic build"
  // return app.toTree();

  const { Webpack } = require('@embroider/webpack');
  return require('@embroider/compat').compatBuild(app, Webpack, {
    //
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    staticHelpers: true,
    staticModifiers: true,
    staticComponents: true,
    // splitAtRoutes: ['route.name'], // can also be a RegExp
    packagerOptions: {
      webpackConfig: {
        ...rdfaEditorWebpackConfig(),
      },
    },
    extraPublicTrees: [],
  });
};

// This matches the auto-import config in the addon:
// https://github.com/lblod/ember-rdfa-editor/blob/8261f1ef8a2b35dd8fc9650832ec4605c68497dd/index.js#L14-L27
function rdfaEditorWebpackConfig() {
  return {
    node: {
      global: true,
      __filename: true,
      __dirname: true,
    },
    resolve: {
      fallback: {
        // ember-rdfa-editor brings these in, we _should_ add them to our own package.json, but this is only temporary
        stream: require.resolve('stream-browserify'), // eslint-disable-line n/no-extraneous-require
        crypto: require.resolve('crypto-browserify'), // eslint-disable-line n/no-extraneous-require
      },
    },
  };
}
