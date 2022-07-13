import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class EredienstMandatenbeheerMandatarisEditRoute extends Route {
  @service currentSession;

  async beforeModel() {
    const mandataris = await this.modelFor(
      'eredienst-mandatenbeheer.mandataris'
    );
    const persoon = await mandataris.isBestuurlijkeAliasVan;

    const bestuursorganen = await this.currentSession.group.bestuursorganen;
    const tijdsspecialisaties = await bestuursorganen.firstObject
      .heeftTijdsspecialisaties;

    this.bestuursorganen = tijdsspecialisaties;

    this.contacts = await this.store.query('contact-punt', {
      'filter[mandataris][is-bestuurlijke-alias-van][id]': persoon.id,
      include: 'adres',
    });
  }

  setupController(controller) {
    super.setupController(...arguments);

    controller.bestuursorganen = this.bestuursorganen;
    controller.contactList = this.contacts;
  }
}
