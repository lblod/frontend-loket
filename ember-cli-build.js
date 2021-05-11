'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  const customBuildConfig = {
    // Add options here
    'ember-cli-babel': {
      includePolyfill: true
    },
    sassOptions: {
      includePaths: [
        'node_modules/@appuniversum/appuniversum',
        'node_modules/@appuniversum/ember-appuniversum/app/styles',
      ]
    }
  };

  if(process.env.EMBER_TEST_SELECTORS_STRIP == 'false'){
    customBuildConfig['ember-test-selectors'] = { strip: false };
  }
  else if(process.env.EMBER_TEST_SELECTORS_STRIP == 'true'){
    customBuildConfig['ember-test-selectors'] = { strip: true };
  }
  //if EMBER_TEST_SELECTORS_STRIP left unspecificied, we fall back to default behavoir

  let app = new EmberApp(defaults, customBuildConfig);

  app.import('node_modules/svgxuse/svgxuse.js');

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  const { Webpack } = require('@embroider/webpack');
  return require('@embroider/compat').compatBuild(app, Webpack, {
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    staticHelpers: true,
    staticComponents: true,
    splitAtRoutes: [
      'mock-login',
      'contact',
      'legaal',
      'mandatenbeheer',
      'bbcdr',
      'supervision',
      'toezicht',
      'berichtencentrum',
      'leidinggevendenbeheer',
      'personeelsbeheer',
      'subsidy',
      'help',
    ], // can also be a RegExp
  });
};
