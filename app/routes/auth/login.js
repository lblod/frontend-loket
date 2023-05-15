import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ENV from 'frontend-loket/config/environment';

export default class AuthLoginRoute extends Route {
  @service router;
  @service session;

  beforeModel() {
    if (this.session.prohibitAuthentication('index')) {
      if (isValidAcmidmConfig(ENV.acmidm)) {
        window.location.replace(buildLoginUrl(ENV.acmidm));
      } else {
        this.router.replaceWith('mock-login');
      }
    }
  }
}

function buildLoginUrl({ authUrl, clientId, authRedirectUrl, scope }) {
  let loginUrl = new URL(authUrl);
  let searchParams = loginUrl.searchParams;

  searchParams.append('response_type', 'code');
  searchParams.append('client_id', clientId);
  searchParams.append('redirect_uri', authRedirectUrl);
  searchParams.append('scope', scope);

  return loginUrl.href;
}

function isValidAcmidmConfig(acmidmConfig) {
  return Object.values(acmidmConfig).every(
    (value) =>
      typeof value === 'string' &&
      value.trim() !== '' &&
      !value.startsWith('{{')
  );
}
