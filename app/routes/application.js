import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import { inject as service } from '@ember/service';
import ENV from 'frontend-loket/config/environment';
export default Route.extend(ApplicationRouteMixin, {
  currentSession: service(),
  moment: service(),

  beforeModel() {
    const moment = this.get('moment');
    moment.setLocale('nl-be');
    moment.setTimeZone('Europe/Brussels');
    moment.set('defaultFormat', 'DD MMM YYYY, HH:mm');

    return this._loadCurrentSession();
  },

  sessionAuthenticated() {
    this._super(...arguments);
    this._loadCurrentSession();
  },

  sessionInvalidated() {
    const logoutUrl = ENV['torii']['providers']['acmidm-oauth2']['logoutUrl'];
    if (logoutUrl.startsWith('http')) {
      window.location.replace(logoutUrl);
    }
    else {
      console.warn('incorrect logoutUrl set');
    }
  },

  _loadCurrentSession() {
    return this.currentSession.load().catch((e) => {
      console.warn('invalidating because of foo');
      console.warn(e);
      this.session.invalidate();
    });

  }
});
