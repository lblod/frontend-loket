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

  let app = new EmberApp(defaults, customBuildConfig);

  return app.toTree();
};
