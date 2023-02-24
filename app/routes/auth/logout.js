import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ENV from 'frontend-loket/config/environment';

export default class AuthLogoutRoute extends Route {
  @service router;
  @service session;

  async beforeModel(transition) {
    if (this.session.requireAuthentication(transition, 'login')) {
      try {
        let wasMockLoginSession = this.session.isMockLoginSession;
        await this.session.invalidate();
        let logoutUrl = wasMockLoginSession
          ? this.router.urlFor('mock-login')
          : ENV.acmidm.logoutUrl;

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
}
