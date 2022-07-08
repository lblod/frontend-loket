import Route from '@ember/routing/route';

export default class EredienstMandatenbeheerMandatarisContactPointsEditRoute extends Route {
  model(params) {
    return this.store.findRecord('contact-punt', params.contact_id, {
      include: 'adres',
    });
  }

  setupController(controller, model) {
    super.setupController(...arguments);
    controller.adres = model.adres;
  }
}
