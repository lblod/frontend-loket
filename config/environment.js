'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'frontend-loket',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    moment: {
      allowEmpty: true
    },
    'vo-webuniversum': {
      version: '2.8.3',
      header: '//widgets.vlaanderen.be/widget/live/1f2f13286a664241801cf21cd5a12316',
      footer: '//widgets.vlaanderen.be/widget/live/36cb38a7d97d4ea29cde109aa0994201'
    },
    torii: {
      disableRedirectInitializer: true,
      providers: {
        'acmidm-oauth2': {
          apiKey: 'a2c0d6ea-01b4-4f68-920b-10834a943c27',
          baseUrl: 'https://authenticatie-ti.vlaanderen.be/op/v1/auth',
          scope: 'openid rrn vo profile abb_loketLB',
          redirectUri: 'https://loket.lblod.info/authorization/callback',
          logoutUrl: 'https://authenticatie-ti.vlaanderen.be/op/v1/logout'
        }
      }
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  if (process.env.DEPLOY_ENV === 'production') {
    ENV['vo-webuniversum']['header'] = '//widgets.vlaanderen.be/widget/live/f91ec2eea9de4de399ef3e0f19db8c58';
    ENV['vo-webuniversum']['footer'] = '//widgets.vlaanderen.be/widget/live/2833ae2aacff426e9445a336140d7420';
  }

  return ENV;
};
