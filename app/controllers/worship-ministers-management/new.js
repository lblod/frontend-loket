import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';

export default class WorshipMinistersManagementNewController extends Controller {
  @service router;
  @service store;

  queryParams = ['personId'];

  @tracked personId = '';

  get shouldSelectPerson() {
    return !this.model?.person;
  }

  @action
  selectPersoon(persoon) {
    this.router.transitionTo({ queryParams: { personId: persoon.id } });
  }

  @action
  createNewPerson() {
    this.router.transitionTo('worship-ministers-management.new-person');
  }

  @action
  async handleDateChange(type, isoDate, date) {
    const { worshipMinister } = this.model;
    worshipMinister[type] = date;
    let { agentStartDate, agentEndDate } = worshipMinister;
    if (agentEndDate instanceof Date && agentStartDate instanceof Date) {
      if (agentEndDate <= agentStartDate) {
        worshipMinister.errors.add(
          'agentEndDate',
          'De einddatum moet na de startdatum liggen'
        );
      }
    }
  }

  @action
  cancel() {
    this.router.transitionTo('worship-ministers-management');
  }

  @dropTask
  *createWorshipMinister(event) {
    event.preventDefault();

    let { worshipMinister } = this.model;
    if (!worshipMinister.isValid) {
      return;
    }
    yield worshipMinister.save();

    this.router.transitionTo(
      'worship-ministers-management.minister.edit',
      worshipMinister.id
    );
  }
}
