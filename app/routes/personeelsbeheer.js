import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PersoneelsbeheerRoute extends Route {
  @service currentSession;
  @service session;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');

    if (!this.currentSession.canAccessPersoneelsbeheer)
      this.transitionTo('index');
  }

  model() {
    return this.currentSession.group; // bestuurseenheid
  }
}
