import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import ENV from 'frontend-loket/config/environment';

export default Controller.extend({
  session: service(),
  currentSession: service(),
  ajax: service(),
  init() {
    this._super(...arguments);
    this.set('header', ENV['vo-webuniversum']['header']);
  },
  actions: {
    async switchUser() {
      const logoutUrl = ENV.torii.providers['acmidm-oauth2'].logoutUrl;
      const clientId = ENV.torii.providers['acmidm-oauth2'].apiKey;
      const returnUrl= ENV.torii.providers['acmidm-oauth2'].switchUrl;
      this.set('loadingSwitch', true);
      await this.ajax.del('/sessions/current');
      window.location.replace(`${logoutUrl}?switch=true&client_id=${clientId}&post_logout_redirect_uri=${encodeURIComponent(returnUrl)}`);
    }
  }
});
