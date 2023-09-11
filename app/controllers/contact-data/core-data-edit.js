/* eslint-disable ember/no-get */
import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class CoreDataEditController extends Controller {
  @service currentSession;
  @service router;

  @task
  *save(event) {
    event.preventDefault();
    const { address, coreData, primaryContact, secondaryContact } = this.model;
    console.log('Before validation');
    yield Promise.all([
      coreData.validate(),
      address.validate(),
      primaryContact.validate(),
      secondaryContact.validate(),
    ]);
  }

  @action
  cancel(event) {
    event.preventDefault();
    this.router.transitionTo('contact-data.core-data-overview');
  }
}
