import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ENV from 'frontend-loket/config/environment';

export default class AuthLoginRoute extends Route {
  @service session;

  beforeModel() {
    if (this.session.prohibitAuthentication('index')) {
      window.location.replace(buildLoginUrl(ENV.acmidm));
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
