import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { findPrimaryContactPoint } from 'frontend-loket/models/contact-punt';
export default class EredienstMandatenbeheerMandatarisDetailsRoute extends Route {
  @service currentSession;
  @service store;

  async beforeModel() {
    const mandataris = await this.modelFor(
      'eredienst-mandatenbeheer.mandataris'
    );

    let positionContacts = await mandataris.contacts;
    this.selectedContact = findPrimaryContactPoint(positionContacts);
  }

  model() {
    return this.modelFor('eredienst-mandatenbeheer.mandataris');
  }

  setupController(controller) {
    super.setupController(...arguments);

    controller.contact = this.selectedContact;
  }
}
