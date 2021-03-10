import SessionService from 'ember-simple-auth/services/session';
import ENV from 'frontend-loket/config/environment';

export default SessionService.extend({

  handleInvalidation() {
    const logoutUrl = ENV['torii']['providers']['acmidm-oauth2']['logoutUrl'];
    if (logoutUrl.startsWith('http')) {
      window.location.replace(logoutUrl);
    }
    else {
      warn('Incorrect logout URL configured', { id: 'session-invalidation-failure' });
    }
  },

});
