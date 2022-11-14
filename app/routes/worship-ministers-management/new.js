import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { CONTACT_TYPE } from 'frontend-loket/models/contact-punt';

export default class WorshipMinisterManagementNewRoute extends Route {
  @service currentSession;
  @service store;

  queryParams = {
    personId: {
      refreshModel: true,
    },
  };

  async model({ personId }, transition) {
    if (personId) {
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
      // Pre select only where there is one primary contact point
      if (contacts.length === 1) {
        transition.data.selectedContact = contacts.firstObject;
      }

      return {
        worshipMinister,
        currentWorshipService: this.currentSession.group,
        person,
        contacts,
      };
    }
    return {};
  }

  setupController(controller, model, transition) {
    super.setupController(...arguments);
    if (!controller.hasContact && !controller.shouldSelectPerson) {
      controller.addNewContact();
    }
    controller.selectedContact = transition.data.selectedContact;
  }

  resetController(controller, isExiting) {
    super.resetController(...arguments);

    if (isExiting) {
      controller.personId = '';
      controller.model?.worshipMinister?.rollbackAttributes();
      controller.rollbackUnsavedChanges();
    }
  }
}
