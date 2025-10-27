'use strict';

module.exports = function (environment) {
  const ENV = {
    modulePrefix: 'frontend-loket',
    environment,
    rootURL: '/',
    locationType: 'history',
    EmberENV: {
      EXTEND_PROTOTYPES: false,
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
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
    features: {
      // 'feature-name': '{{FEATURE_ENV_VAR_NAME}}',
      'new-loket': '{{FEATURE_NEW_LOKET}}',
    },
    lpdcUrl: '{{LPDC_URL}}',
    subsidiesUrl: '{{SUBSIDIES_URL}}',
    dataMonitoringToolUrl: '{{DATA_MONITORING_TOOL_URL}}',
    ovamUrl: '{{OVAM_URL}}',
    worshipDecisionsDatabaseUrl: '{{WORSHIP_DECISIONS_DATABASE_URL}}',
    worshipOrganisationsDatabaseUrl: '{{WORSHIP_ORGANISATIONS_DATABASE_URL}}',
    mandatenbeheerExternalUrl: '{{MANDATENBEHEER_EXTERNAL_URL}}',
    verenigingenUrl: '{{VERENIGINGEN_URL}}',
    contactUrl: '{{CONTACT_URL}}',
    openProcesHuisUrl: '{{OPEN_PROCES_HUIS_URL}}',
    openProcesHuisRole: '{{OPEN_PROCES_HUIS_ROLE}}', // TODO: remove this once the actual role is known
    plausible: {
      domain: '{{ANALYTICS_APP_DOMAIN}}',
      apiHost: '{{ANALYTICS_API_HOST}}',
    },
    sentry: {
      dsn: '{{SENTRY_DSN}}',
      environment: '{{SENTRY_ENVIRONMENT}}',
    },
    urlMap: '{{PUBLIC_SERVICE_URL_MAP}}',
    '@sentry/ember': {
      // Performance tracking isn't super useful for us yet and it sends a lot of data to the backend (which counts against the free tier limit).
      // It also prevents the performance instrumentation code from running when Sentry isn't enabled (which is something that ideally is fixed in the addon itself).
      disablePerformance: true,
    },
    globalSystemNotification: '{{GLOBAL_SYSTEM_NOTIFICATION}}',
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    if (process.env.NEW_LOKET) {
      ENV.features['new-loket'] = 'true';
      ENV.urlMap = JSON.stringify({
        // This converts all production loket url to local ones (and "/" if there is no path)
        'https://loket.lokaalbestuur.vlaanderen.be': '',
      });
    }
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
