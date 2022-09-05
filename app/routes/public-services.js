import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PublicServicesRoute extends Route {
  @service currentSession;
  @service session;
  @service router;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');

    if (!this.currentSession.canAccessPublicServices)
      this.router.transitionTo('index');
  }
}
