import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import { inject as service } from '@ember/service';
import ENV from 'frontend-loket/config/environment';
import { warn } from '@ember/debug';

export default class ApplicationRoute extends Route.extend(ApplicationRouteMixin) {
  @service() currentSession;
  @service() moment;

  beforeModel() {
    const moment = this.moment;
    moment.setLocale('nl-be');
    moment.setTimeZone('Europe/Brussels');
    moment.set('defaultFormat', 'DD MMM YYYY, HH:mm');

    return this._loadCurrentSession();
  }

  sessionAuthenticated() {
    super.sessionAuthenticated(...arguments);
    this._loadCurrentSession();
  }

  sessionInvalidated() {
    const logoutUrl = ENV['torii']['providers']['acmidm-oauth2']['logoutUrl'];
    if (logoutUrl.startsWith('http')) {
      window.location.replace(logoutUrl);
    }
    else {
      warn('Incorrect logout URL configured', { id: 'session-invalidation-failure' });
    }
  }

  _loadCurrentSession() {
    return this.currentSession.load().catch((e) => {
      warn(e, { id: 'session-load-failure' });
      this.session.invalidate();
    });

  }
}

