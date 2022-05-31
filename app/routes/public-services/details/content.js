import Route from '@ember/routing/route';

export default class PublicServicesDetailsContentRoute extends Route {
  model() {
    return this.modelFor('public-services.details');
  }
}
