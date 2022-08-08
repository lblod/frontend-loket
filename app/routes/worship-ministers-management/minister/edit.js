import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
// import {
//   CONTACT_TYPE,
//   findPrimaryContactPoint,
// } from 'frontend-loket/models/contact-punt';

export default class WorshipMinistersManagementMinisterEditRoute extends Route {
  @service store;

  queryParams = ['ministerId'];
  @tracked ministerId = '';

  // async beforeModel() {
  //   // const bedienarenbeheer = this.modelFor('worship-ministers-management');
  //   // this.bestuursorganen = bedienarenbeheer.naam;
  //   // const persoon = await this.store.findRecord(
  //   //   'minister',
  //   //   params.to.params.bedienaar_id
  //   // );
  //   // console.log(persoon);
  //   // let positionContacts = await bedienaar.contacts;
  //   // this.selectedContact = findPrimaryContactPoint(positionContacts);
  //   // this.contacts = await this.store.query('contact-punt', {
  //   //   'filter[agents-in-position][is-bestuurlijke-alias-van][id]': persoon.id,
  //   //   'filter[type]': CONTACT_TYPE.PRIMARY,
  //   //   include: 'adres,secondary-contact-point',
  //   // });
  // }

  model(params) {
    return this.store.findRecord('minister', params.bedienaar_id);
  }

  // setupController(controller) {
  //   super.setupController(...arguments);

  //   // controller.bestuursorganen = this.bestuursorganen;
  //   // controller.contactList = this.contacts;
  //   // controller.selectedContact = this.selectedContact;
  // }

  // resetController(controller) {
  //   super.resetController(...arguments);

  //   controller.rollbackUnsavedChanges();
  // }
}
