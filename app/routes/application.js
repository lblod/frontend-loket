import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import { inject as service } from '@ember/service';
import ENV from 'frontend-loket/config/environment';

export default Route.extend(ApplicationRouteMixin, {
  currentSession: service(),

  beforeModel() {
    return this._loadCurrentSession();
  },

  sessionAuthenticated() {
    this._super(...arguments);
    this._loadCurrentSession();
  },

  sessionInvalidated() {
    const logoutUrl = ENV['torii']['providers']['acmidm-oauth2']['logoutUrl'];
    window.location.replace(logoutUrl);
  },

  _loadCurrentSession() {
    return this.get('currentSession').load().catch(() => this.get('session').invalidate());
  }
});
