import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class BerichtencentrumRoute extends Route {
  @service() session;
  @service() currentSession;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');

    if (!this.currentSession.canAccessBerichten) this.transitionTo('index');
  }
}
