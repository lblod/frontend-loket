import Route from '@ember/routing/route';

export default class PublicServicesDetailsPropertiesRoute extends Route {
  model() {
    return this.modelFor('public-services.details');
  }
}
