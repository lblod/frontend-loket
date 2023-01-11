import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import {
  CONTACT_TYPE,
  findPrimaryContactPoint,
} from 'frontend-loket/models/contact-punt';
export default class EredienstMandatenbeheerMandatarisDetailsRoute extends Route {
  @service currentSession;
  @service store;

  async beforeModel() {
    const mandatenbeheer = await this.modelFor('eredienst-mandatenbeheer');
    this.bestuurseenheid = mandatenbeheer.bestuurseenheid;
    const mandataris = await this.modelFor(
      'eredienst-mandatenbeheer.mandataris'
    );
    const persoon = await mandataris.isBestuurlijkeAliasVan;

    let positionContacts = await mandataris.contacts;
    this.selectedContact = findPrimaryContactPoint(positionContacts);

    this.contacts = await this.store.query('contact-punt', {
      'filter[agents-in-position][is-bestuurlijke-alias-van][id]': persoon.id,
      'filter[type]': CONTACT_TYPE.PRIMARY,
      include: 'adres,secondary-contact-point',
    });
  }

  model() {
    return this.modelFor('eredienst-mandatenbeheer.mandataris');
  }

  setupController(controller) {
    super.setupController(...arguments);

    controller.contactList = this.contacts;
    controller.bestuurseenheid = this.bestuurseenheid;
  }
}
