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
    // const bestuurseenheid = this.currentSession.group;
    // console.log(bestuurseenheid.get('id'));
    const minister = await this.store.findRecord(
      'minister',
      params.minister_id
    );
    const ministerPositionFunctions = await this.store.findAll(
      'minister-position-function'
    );
    // This is giving me a 500 error
    // const ministerPositionFunctions = await this.store.query(
    //   'minister-position',
    //   { 'filter[worship-administrative-unit][:id:]': bestuurseenheid.get('id') }
    // );

    // console.log(ministerPositionFunctions);
    this.worshipMinister = minister;

    this.ministerPositionFunctions = ministerPositionFunctions;

    let person = await this.worshipMinister.get('person');

    let positionContacts = await this.worshipMinister.get('contacts');
    this.selectedContact = findPrimaryContactPoint(positionContacts);

    this.contacts = await this.store.query('contact-punt', {
      'filter[agents-in-position][person][id]': person.get('id'),
      'filter[type]': CONTACT_TYPE.PRIMARY,
      include: 'adres,secondary-contact-point',
    });
    return minister;
  }

  setupController(controller) {
    super.setupController(...arguments);

    controller.worshipMinister = this.worshipMinister;
    controller.ministerPositionFunctions = this.ministerPositionFunctions;

    controller.contactList = this.contacts;
    controller.selectedContact = this.selectedContact;
  }

  resetController(controller, isExiting) {
    super.resetController(...arguments);

    controller.rollbackUnsavedChanges();

    if (isExiting) {
      // TODO: fix minister-position-function does not rollback
      controller.ministerId = '';
      controller.model?.worshipMinister?.rollbackAttributes();
    }
  }
}
