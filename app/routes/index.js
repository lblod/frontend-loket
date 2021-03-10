import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class IndexRoute extends Route{
  @service session;
  @service currentSession;

  async beforeModel(transition) {
    this.currentSession.load();
    this.session.requireAuthentication(transition, 'login');
  }

}
