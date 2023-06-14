import { init as initSentry } from '@sentry/ember';
import config from 'frontend-loket/config/environment';

export const SHOULD_ENABLE_SENTRY = config.sentry.dsn !== '{{SENTRY_DSN}}';

export function setupSentry() {
  if (SHOULD_ENABLE_SENTRY) {
    let sentryEnvironment =
      config.sentry.environment !== '{{SENTRY_ENVIRONMENT}}'
        ? config.sentry.environment
        : 'production';

    initSentry({
      dsn: config.sentry.dsn,
      release: config.APP.version, // ember-cli-app-version sets this value
      environment: sentryEnvironment,
      autoSessionTracking: false, // Not implemented by GlitchTip so it triggers a lot of 501 "Not implemented" responses
    });
  }
}
