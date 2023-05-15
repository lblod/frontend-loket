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
      clientId: '{{ACMIDM_CLIENT_ID}}',
      scope: 'openid rrn vo profile abb_loketLB',
      authUrl: '{{ACMIDM_AUTH_URL}}',
      logoutUrl: '{{ACMIDM_LOGOUT_URL}}',
      authRedirectUrl: '{{ACMIDM_AUTH_REDIRECT_URL}}',
      switchRedirectUrl: '{{ACMIDM_SWITCH_REDIRECT_URL}}',
    },
    // features: {
    //   'feature-name': '{{FEATURE_ENV_VAR_NAME}}',
    // },
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

  return ENV;
};
