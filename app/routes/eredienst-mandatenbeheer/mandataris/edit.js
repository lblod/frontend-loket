import Route from '@ember/routing/route';

export default class EredienstMandatenbeheerMandatarisEditRoute extends Route {
  async beforeModel() {
    const mandataris = await this.modelFor(
      'eredienst-mandatenbeheer.mandataris'
    );
    const persoon = await mandataris.isBestuurlijkeAliasVan;

    this.contacts = await this.store.query('contact-punt', {
      'filter[mandataris][is-bestuurlijke-alias-van][id]': persoon.id,
      include: 'adres',
    });
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.contactList = this.contacts;
  }
}
