import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class EredienstMandatenbeheerRoute extends Route {
  @service currentSession;
  @service session;
  @service router;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');

    if (!this.currentSession.canAccessEredienstMandatenbeheer)
      this.router.transitionTo('index');
  }
}
