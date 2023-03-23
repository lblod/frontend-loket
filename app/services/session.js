import { inject as service } from '@ember/service';
import SessionService from 'ember-simple-auth/services/session';

export default class LoketSessionService extends SessionService {
  @service currentSession;

  get isMockLoginSession() {
    return this.isAuthenticated
      ? this.data.authenticated.authenticator.includes('mock-login')
      : false;
  }

  async handleAuthentication(routeAfterAuthentication) {
    // We wait for the currentSession to load before navigating. This fixes the empty index page since the data might not be loaded yet.
    await this.currentSession.load();
    super.handleAuthentication(routeAfterAuthentication);
  }

  handleInvalidation() {
    // We don't want the default redirecting logic of the base class since we handle this ourselves in other places already.
    // We can't do the logic here since we don't know which authenticator did the invalidation and we don't receive the arguments that are passed to `.invalidate` either.
    // This is needed to be able to support both normal logouts, switch logouts (and as a bonus,also mock logouts).
  }
}
