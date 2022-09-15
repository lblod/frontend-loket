import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import {
  CONTACT_TYPE,
  findPrimaryContactPoint,
} from 'frontend-loket/models/contact-punt';

export default class WorshipMinistersManagementMinisterEditRoute extends Route {
  @service store;
  @service currentSession;

  async model() {
    let { worshipMinisterId } = this.paramsFor(
      'worship-ministers-management.minister'
    );

    const minister = await this.store.findRecord(
      'minister',
      worshipMinisterId,
      {
        include: ['person', 'contacts', 'minister-position.function'].join(),
      }
    );

    let person = await minister.person;
    let positionContacts = await minister.contacts;
    this.selectedContact = findPrimaryContactPoint(positionContacts);

    let contacts = await this.store.query('contact-punt', {
      'filter[agents-in-position][person][:id:]': person.id,
      'filter[type]': CONTACT_TYPE.PRIMARY,
      include: 'adres,secondary-contact-point',
    });

    return {
      minister,
      person,
      contacts,
      currentWorshipService: this.currentSession.group,
    };
  }

  setupController(controller) {
    super.setupController(...arguments);

    controller.selectedContact = this.selectedContact;
  }

  resetController(controller) {
    super.resetController(...arguments);

    controller.rollbackUnsavedChanges();
  }
}
