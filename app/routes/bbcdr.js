import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class BbcdrRoute extends Route {
  @service session;
  @service() currentSession;

  beforeModel() {
    if (!this.currentSession.canAccessBbcdr)
      this.transitionTo('index');
  }
}

