import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ENV from 'frontend-loket/config/environment';

export default class AuthSwitchRoute extends Route {
  @service router;
  @service session;

  async beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');

    try {
      let wasMockLoginSession = this.session.isMockLoginSession;
      await this.session.invalidate();
      let logoutUrl = wasMockLoginSession
        ? this.router.urlFor('mock-login')
        : buildSwitchUrl(ENV.acmidm);

      window.location.replace(logoutUrl);
    } catch (error) {
      throw new Error(
        'Something went wrong while trying to remove the session on the server',
        {
          cause: error,
        }
      );
    }
  }
}

function buildSwitchUrl({ logoutUrl, clientId, switchRedirectUrl }) {
  let switchUrl = new URL(logoutUrl);
  let searchParams = switchUrl.searchParams;

  searchParams.append('switch', true);
  searchParams.append('client_id', clientId);
  searchParams.append('post_logout_redirect_uri', switchRedirectUrl);

  return switchUrl.href;
}
