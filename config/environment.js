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
    acmidm: {
      clientId: 'a2c0d6ea-01b4-4f68-920b-10834a943c27',
      scope: 'openid rrn vo profile abb_loketLB',
      authUrl: 'https://authenticatie-ti.vlaanderen.be/op/v1/auth',
      logoutUrl: 'https://authenticatie-ti.vlaanderen.be/op/v1/logout',
      authRedirectUrl: 'https://loket.lblod.info/authorization/callback',
      switchRedirectUrl: 'https://loket.lblod.info/switch-login',
    },
    features: {
      'eredienst-mandatenbeheer':
        '{{FEATURE_EREDIENSTEN_MANDATENBEHEER_ENABLED}}',
      'public-services': '{{FEATURE_PUBLIC_SERVICES_ENABLED}}',
      'worship-minister-management':
        '{{FEATURE_WORSHIP_MINISTER_MANAGEMENT_ENABLED}}',
    },
    worshipDecisionsDatabaseUrl: '{{WORSHIP_DECISIONS_DATABASE_URL}}',
    worshipOrganisationsDatabaseUrl: '{{WORSHIP_ORGANISATIONS_DATABASE_URL}}',
    'ember-plausible': {
      enabled: false,
    },
    plausible: {
      domain: '{{ANALYTICS_APP_DOMAIN}}',
      apiHost: '{{ANALYTICS_API_HOST}}',
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
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  if (process.env.DEPLOY_ENV === 'production') {
    ENV.acmidm = {
      ...ENV.acmidm,
      clientId: '90a39574-e986-4007-84f2-becf6d9eb481',
      authUrl: 'https://authenticatie.vlaanderen.be/op/v1/auth',
      logoutUrl: 'https://authenticatie.vlaanderen.be/op/v1/logout',
      authRedirectUrl:
        'https://loket.lokaalbestuur.vlaanderen.be/authorization/callback',
      switchRedirectUrl:
        'https://loket.lokaalbestuur.vlaanderen.be/switch-login',
    };
  }

  return ENV;
};
