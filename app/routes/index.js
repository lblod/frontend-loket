import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class IndexRoute extends Route {
  @service currentSession;
  @service session;
  @service router;
  @service toaster;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.searchTerm = null;
    controller.selectedProduct = null;
  }

  @action
  loading() {
    // We don't want the loading substate for this route.
    return false;
  }
}
