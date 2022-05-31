import Route from '@ember/routing/route';

export default class PublicServicesDetailsTranslationsRoute extends Route {
  model() {
    return this.modelFor('public-services.details');
  }
}
