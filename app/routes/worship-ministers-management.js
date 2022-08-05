import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class WorshipMinistersManagementRoute extends Route {
  @service currentSession;
  @service session;
  @service router;
  @service store;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');

    if (!this.currentSession.canAccessBedienarenbeheer)
      this.router.transitionTo('index');
  }

  async model() {
    return this.currentSession.group; // bestuurseenheid
  }
}
