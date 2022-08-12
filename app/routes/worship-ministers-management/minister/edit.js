import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import {
  CONTACT_TYPE,
  findPrimaryContactPoint,
} from 'frontend-loket/models/contact-punt';

export default class WorshipMinistersManagementMinisterEditRoute extends Route {
  @service store;

  queryParams = ['minister_id'];
  @tracked ministerId = '';

  async beforeModel() {
    // TODO: Adding contacts to the table
  }

  async model(params) {
    const minister = await this.store.findRecord(
      'minister',
      params.minister_id
    );
    const ministerPositionFunctions = await this.store.findAll(
      'minister-position-function'
    );
    this.bedienaar = minister;
    // TODO: Filter the right position function from the selected worship cult
    this.ministerPositionFunctions = ministerPositionFunctions;
    // let persoon = this.bedienaar.person;
    // let positionContacts = await this.bedienaar.contacts;
    // this.selectedContact = findPrimaryContactPoint(positionContacts);

    // this.contacts = await this.store.query('contact-punt', {
    //   'filter[agents-in-position][is-bestuurlijke-alias-van][id]': persoon.id,
    //   'filter[type]': CONTACT_TYPE.PRIMARY,
    //   include: 'adres,secondary-contact-point',
    // });
    return this.store.findRecord('minister', params.minister_id);
  }

  setupController(controller) {
    super.setupController(...arguments);

    controller.bedienaar = this.bedienaar;
    controller.ministerPositionFunctions = this.ministerPositionFunctions;

    // controller.contactList = this.contacts;
    // controller.selectedContact = this.selectedContact;
  }

  resetController(controller) {
    super.resetController(...arguments);

    controller.rollbackUnsavedChanges();
  }
}
