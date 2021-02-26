import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SubsidyRoute extends Route {
  @service session;
  @service currentSession;

  beforeModel() {
    if (!this.currentSession.canAccessSubsidies)
      this.transitionTo('index');
  }
}
