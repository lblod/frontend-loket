import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { warn } from '@ember/debug';
import ENV from 'frontend-loket/config/environment';
import 'moment';
import 'moment-timezone';

export default class ApplicationRoute extends Route {
  @service currentSession;
  @service intl;
  @service moment;
  @service session;
  @service plausible;
  @service router;

  async beforeModel() {
    await this.session.setup();

    // ember-intl defaults to en-US and ember-rdfa-editor uses translations internally
    this.intl.setLocale(['nl-BE']);

    const moment = this.moment;
    moment.setLocale('nl-be');
    moment.setTimeZone('Europe/Brussels');
    moment.set('defaultFormat', 'DD MMM YYYY, HH:mm');

    this.startAnalytics();

    return this._loadCurrentSession();
  }

  startAnalytics() {
    let { domain, apiHost } = ENV.plausible;

    if (
      domain !== '{{ANALYTICS_APP_DOMAIN}}' &&
      apiHost !== '{{ANALYTICS_API_HOST}}'
    ) {
      this.plausible.enable({
        domain,
        apiHost,
      });
    }
  }

  async _loadCurrentSession() {
    try {
      await this.currentSession.load();
    } catch (error) {
      warn(error, { id: 'current-session-load-failure' });
      this.router.transitionTo('auth.logout');
    }
  }
}
