import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import {
  CONTACT_TYPE,
  findPrimaryContactPoint,
} from 'frontend-loket/models/contact-punt';
export default class EredienstMandatenbeheerMandatarisEditRoute extends Route {
  @service currentSession;
  @service store;
  @service router;

  async beforeModel() {
    if (this.currentSession.hasViewOnlyWorshipMandateesManagementData) {
      this.router.transitionTo('eredienst-mandatenbeheer.mandataris.details');
    }
    const mandatenbeheer = this.modelFor('eredienst-mandatenbeheer');

    this.bestuursorganen = mandatenbeheer.bestuursorganen;

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

    controller.bestuursorganen = this.bestuursorganen;
    controller.contactList = this.contacts;
    controller.selectedContact = this.selectedContact;
  }

  resetController(controller) {
    super.resetController(...arguments);

    controller.rollbackUnsavedChanges();
  }
}
