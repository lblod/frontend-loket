import Route from '@ember/routing/route';

export default class PublicServicesConceptDetailsPropertiesRoute extends Route {
  model() {
    return this.modelFor('public-services.concept-details');
  }
}
