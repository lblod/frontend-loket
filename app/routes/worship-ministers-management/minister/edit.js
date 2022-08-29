import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import {
  CONTACT_TYPE,
  findPrimaryContactPoint,
} from 'frontend-loket/models/contact-punt';

export default class WorshipMinistersManagementMinisterEditRoute extends Route {
  @service store;
  @service currentSession;

  queryParams = ['minister_id'];
  @tracked ministerId = '';

  async model(params) {
    const minister = await this.store.findRecord(
      'minister',
      params.minister_id
    );

    this.worshipMinister = minister;

    let person = await this.worshipMinister.get('person');

    let positionContacts = await this.worshipMinister.get('contacts');
    this.selectedContact = findPrimaryContactPoint(positionContacts);

    this.contacts = await this.store.query('contact-punt', {
      'filter[agents-in-position][person][id]': person.get('id'),
      'filter[type]': CONTACT_TYPE.PRIMARY,
      include: 'adres,secondary-contact-point',
    });

    return {
      minister,
      person,
      contacts: this.contacts,
      currentWorshipService: this.currentSession.group,
    };
  }

  setupController(controller) {
    super.setupController(...arguments);

    controller.contactList = this.contacts;
    controller.selectedContact = this.selectedContact;
  }

  resetController(controller, isExiting) {
    super.resetController(...arguments);

    controller.rollbackUnsavedChanges();

    if (isExiting) {
      controller.ministerId = '';
    }
  }
}
