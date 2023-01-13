import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { findPrimaryContactPoint } from 'frontend-loket/models/contact-punt';

export default class WorshipMinistersManagementMinisterDetailsRoute extends Route {
  @service store;

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

    let positionContacts = await minister.contacts;
    this.selectedContact = findPrimaryContactPoint(positionContacts);

    return minister;
  }

  setupController(controller) {
    super.setupController(...arguments);

    controller.contact = this.selectedContact;
  }
}
