import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class BerichtencentrumRoute extends Route {
  @service() session;
  @service() currentSession;

  beforeModel() {
    if (!this.currentSession.canAccessBerichten)
      this.transitionTo('index');
  }
}
