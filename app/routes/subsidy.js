import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SubsidyRoute extends Route {
  @service session;
  @service currentSession;
  @service router;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }
}
