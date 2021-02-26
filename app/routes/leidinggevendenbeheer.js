import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class LeidinggevendenbeheerRoute extends Route {
  @service session;
  @service currentSession;

  beforeModel() {
    if (!this.currentSession.canAccessLeidinggevenden)
      this.transitionTo('index');
  }

  model() {
    return this.currentSession.group;
  }

}
