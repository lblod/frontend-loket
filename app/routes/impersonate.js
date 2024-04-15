import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ImpersonateRoute extends Route {
  @service currentSession;
  @service router;
  @service session;
  @service store;

  queryParams = {
    page: {
      refreshModel: true,
    },
  };

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');

    if (!this.currentSession.isAdmin) {
      this.router.replaceWith('index');
    }
  }

  model() {
    // We need to return something truthy here, otherwise the setupController hook isn't called..
    return {};
  }

  setupController(controller) {
    controller.setup();
  }
}
