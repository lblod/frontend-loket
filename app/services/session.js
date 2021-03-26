import { warn } from '@ember/debug';
import { inject as service } from '@ember/service';
import SessionService from 'ember-simple-auth/services/session';
import ENV from 'frontend-loket/config/environment';

export default class LoketSessionService extends SessionService {
  @service currentSession;

  handleAuthentication(routeAfterAuthentication) {
    super.handleAuthentication(routeAfterAuthentication);
    this.currentSession.load();
  }

  handleInvalidation() {
    const logoutUrl = ENV['torii']['providers']['acmidm-oauth2']['logoutUrl'];
    if (logoutUrl.startsWith('http')) {
      super.handleInvalidation(logoutUrl);
    } else {
      warn('Incorrect logout URL configured', { id: 'session-invalidation-failure' });
    }
  }
}
