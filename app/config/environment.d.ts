/**
 * Type declarations for
 *    import config from 'frontend-loket/config/environment'
 */
declare const config: {
  environment: string;
  modulePrefix: string;
  podModulePrefix: string;
  locationType: 'history' | 'hash' | 'none';
  rootURL: string;
  APP: Record<string, unknown>;
  sentry: {
    dsn: string;
    environment: string;
  };
};

export default config;
