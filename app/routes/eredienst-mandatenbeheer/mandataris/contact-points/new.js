import Route from '@ember/routing/route';

export default class EredienstMandatenbeheerMandatarisContactPointsNewRoute extends Route {
  model() {
    return this.modelFor('eredienst-mandatenbeheer.mandataris');
  }

  resetController(controller) {
    super.resetController(...arguments);

    controller.adres = null;
    controller.telephone = '';
    controller.email = '';
  }
}
