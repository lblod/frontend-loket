import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class WorshipMinistersManagementRoute extends Route {
  @service currentSession;
  @service session;
  @service router;
  @service store;

  beforeModel(transition) {
    if (this.session.requireAuthentication(transition, 'login')) {
      if (!this.currentSession.canAccessWorshipMinisterManagement)
        this.router.transitionTo('unauthorized');
    }
  }

  async model() {
    return this.currentSession.group; // bestuurseenheid
  }
}
