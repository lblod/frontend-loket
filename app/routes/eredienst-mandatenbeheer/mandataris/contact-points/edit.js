import Route from '@ember/routing/route';

export default class EredienstMandatenbeheerMandatarisContactPointsEditRoute extends Route {
  async model(params) {
    let contactPoint = await this.store.findRecord(
      'contact-punt',
      params.contactId,
      {
        include: 'adres',
      }
    );

    this.adres = await contactPoint.adres;

    return contactPoint;
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.adres = this.adres;
  }

  resetController(controller) {
    super.resetController(...arguments);

    controller.model.rollbackAttributes();
  }
}
