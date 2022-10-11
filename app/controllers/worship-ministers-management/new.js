import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';
import { validateFunctie } from 'frontend-loket/models/minister';

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
  handleFunctieChange(functie) {
    const { worshipMinister } = this.model;
    worshipMinister.ministerPosition = functie;
    worshipMinister.errors.remove('ministerPosition');
  }

  @action
  handleDateChange(type, isoDate, date) {
    this.model.worshipMinister[type] = date;
  }

  @action
  cancel() {
    this.router.transitionTo('worship-ministers-management');
  }

  @dropTask
  *createWorshipMinister(event) {
    event.preventDefault();

    let { worshipMinister } = this.model;
    if (!worshipMinister.agentStartDate) {
      worshipMinister.errors.add(
        'agentStartDate',
        'startdatum is een vereist veld.'
      );
    }
    if (
      (yield validateFunctie(worshipMinister)) &&
      worshipMinister.agentStartDate &&
      worshipMinister.isValid
    ) {
      yield worshipMinister.save();
      this.router.transitionTo(
        'worship-ministers-management.minister.edit',
        worshipMinister.id
      );
    }
  }
}
