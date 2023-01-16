import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PublicServicesConceptDetailsIndexRoute extends Route {
  @service router;

  beforeModel() {
    this.router.replaceWith('public-services.concept-details.content');
  }
}
