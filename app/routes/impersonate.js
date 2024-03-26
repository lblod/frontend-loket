import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ImpersonateRoute extends Route {
  @service session;
  @service store;

  queryParams = {
    page: {
      refreshModel: true,
    },
  };

  beforeModel(transition) {
    // TODO: verify that the user can impersonate someone, based on their role
    this.session.requireAuthentication(transition, 'login');
  }

  model() {
    // We need to return something truthy here, otherwise the setupController hook isn't called..
    return {};
  }

  setupController(controller) {
    console.log('here');
    controller.setup();
  }
}
