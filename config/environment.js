'use strict';

module.exports = function (environment) {
  let ENV = {
    modulePrefix: 'frontend-loket',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    moment: {
      allowEmpty: true,
      includeLocales: ['nl-be'],
      includeTimezone: 'all',
    },
    torii: {
      disableRedirectInitializer: true,
      providers: {
        'acmidm-oauth2': {
          apiKey: 'a2c0d6ea-01b4-4f68-920b-10834a943c27',
          baseUrl: 'https://authenticatie-ti.vlaanderen.be/op/v1/auth',
          scope: 'openid rrn vo profile abb_loketLB',
          redirectUri: 'https://loket.lblod.info/authorization/callback',
          returnUrl: 'https://loket.lblod.info/switch-login',
          logoutUrl: 'https://authenticatie-ti.vlaanderen.be/op/v1/logout',
        },
      },
    },
    features: {
      'eredienst-mandatenbeheer':
        '{{FEATURE_EREDIENSTEN_MANDATENBEHEER_ENABLED}}',
      'public-services': '{{FEATURE_PUBLIC_SERVICES_ENABLED}}',
      'worship-minister-management':
        '{{FEATURE_WORSHIP_MINISTER_MANAGEMENT_ENABLED}}',
    },
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

    ENV.features['eredienst-mandatenbeheer'] = true;
    ENV.features['public-services'] = true;
    ENV.features['worship-minister-management'] = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
    ENV['torii']['providers']['acmidm-oauth2']['logoutUrl'] = '/logout';
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  if (process.env.DEPLOY_ENV === 'production') {
    ENV['torii']['providers']['acmidm-oauth2']['apiKey'] =
      '90a39574-e986-4007-84f2-becf6d9eb481';
    ENV['torii']['providers']['acmidm-oauth2']['baseUrl'] =
      'https://authenticatie.vlaanderen.be/op/v1/auth';
    ENV['torii']['providers']['acmidm-oauth2']['returnUrl'] =
      'https://loket.lokaalbestuur.vlaanderen.be/switch-login';
    ENV['torii']['providers']['acmidm-oauth2']['redirectUri'] =
      'https://loket.lokaalbestuur.vlaanderen.be/authorization/callback';
    ENV['torii']['providers']['acmidm-oauth2']['logoutUrl'] =
      'https://authenticatie.vlaanderen.be/op/v1/logout';
  }

  return ENV;
};
