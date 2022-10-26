import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import {
  CONTACT_TYPE,
  findPrimaryContactPoint,
} from 'frontend-loket/models/contact-punt';

export default class WorshipMinisterManagementNewRoute extends Route {
  @service currentSession;
  @service store;

  queryParams = {
    personId: {
      refreshModel: true,
    },
  };

  async model({ personId }) {
    if (personId) {
      console.log('step 3');
      let person = await this.store.findRecord('persoon', personId, {
        backgroundReload: false,
      });

      let worshipMinister = this.store.createRecord('minister');
      worshipMinister.person = person;
      let contacts = await this.store.query('contact-punt', {
        'filter[agents-in-position][person][:id:]': person.id,
        'filter[type]': CONTACT_TYPE.PRIMARY,
        include: 'adres,secondary-contact-point',
      });

      console.log('contacts', contacts);

      // Before model ?
      let positionContacts = await worshipMinister.contacts;
      // We create a positionContacts but empty since it's a new worship minister
      // When we found contacts for this person do we fill it ?
      // if (worshipMinister.contacts.content) {
      //   worshipMinister.contacts = contacts;
      // }
      this.selectedContact = findPrimaryContactPoint(positionContacts);

      console.log('findprimarycontact', this.selectedContact);

      return {
        worshipMinister,
        currentWorshipService: this.currentSession.group,
        person,
        contacts,
      };
    }
    console.log('step 1');
    return {};
  }

  setupController(controller) {
    super.setupController(...arguments);

    controller.selectedContact = this.selectedContact;
  }

  resetController(controller, isExiting) {
    super.resetController(...arguments);
    controller.rollbackUnsavedChanges();

    if (isExiting) {
      controller.personId = '';
      controller.model?.worshipMinister?.rollbackAttributes();
    }
  }
}
