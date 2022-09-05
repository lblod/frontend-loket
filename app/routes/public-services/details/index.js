import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PublicServicesDetailsIndexRoute extends Route {
  @service router;

  beforeModel() {
    this.router.replaceWith('public-services.details.content');
  }
}
