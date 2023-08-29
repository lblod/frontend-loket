import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PersoneelsbeheerRoute extends Route {
  @service currentSession;
  @service session;
  @service router;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');

    if (!this.currentSession.canAccessPersoneelsbeheer)
      this.router.transitionTo('index');
  }

  model() {
    return {
      bestuurseenheid: this.currentSession.group,
    };
  }
}
