import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SupervisionRoute extends Route {
  @service session;
  @service currentSession

  beforeModel() {
    if (!this.currentSession.canAccessToezicht)
      this.transitionTo('index');
  }

}
