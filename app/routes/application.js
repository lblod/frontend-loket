import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { warn } from '@ember/debug';
import 'moment';
import 'moment-timezone';

export default class ApplicationRoute extends Route {
  @service currentSession;
  @service moment;
  @service session;

  async beforeModel() {
    await this.session.setup();

    const moment = this.moment;
    moment.setLocale('nl-be');
    moment.setTimeZone('Europe/Brussels');
    moment.set('defaultFormat', 'DD MMM YYYY, HH:mm');

    return this._loadCurrentSession();
  }

  _loadCurrentSession() {
    return this.currentSession.load().catch((e) => {
      warn(e, { id: 'session-load-failure' });
      this.session.invalidate();
    });
  }
}
