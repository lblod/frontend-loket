import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class WorshipMinistersManagementMinisterEditRoute extends Route {
  @service store;

  queryParams = ['minister_id'];
  @tracked ministerId = '';

  async beforeModel() {
    // TODO: Adding contacts to the table
  }

  model(params) {
    return this.store.findRecord('minister', params.minister_id);
  }

  // setupController(controller) {
  //   super.setupController(...arguments);

  //   controller.contactList = this.contacts;
  //   controller.selectedContact = this.selectedContact;
  // }

  // resetController(controller) {
  //   super.resetController(...arguments);

  //   controller.rollbackUnsavedChanges();
  // }
}
