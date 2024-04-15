import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class AuthCallbackRoute extends Route {
  @service session;
  @service router;

  beforeModel() {
    this.session.prohibitAuthentication('index');
  }

  async model({ code }) {
    if (code) {
      try {
        await this.session.authenticate('authenticator:acm-idm', code);
      } catch (error) {
        throw new Error(
          'Something went wrong while authenticating the user in the backend. The token might be expired.',
          { cause: error },
        );
      }
    } else {
      this.router.replaceWith('auth.login');
    }
  }
}
