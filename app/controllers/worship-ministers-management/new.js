import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';

export default class WorshipMinistersManagementNewController extends Controller {
  @service router;
  @service store;

  queryParams = ['personId'];
  @tracked personId = '';
  @tracked options = A(this.getWorshipFunctionsLabels());
  @tracked selected = '';

  getWorshipFunctionsLabels() {
    return this.model.ministerPositionFunctions.map((a) => {
      return a.label;
    });
  }

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
  setWorshipMinisterFunction(worshipFunction) {
    console.log(worshipFunction);
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

    // Need to update the minister-position-function aswell
    let { worshipMinister } = this.model;
    // console.log(worshipMinister);
    yield worshipMinister.save();

    this.router.transitionTo(
      'worship-ministers-management.minister.edit',
      worshipMinister.id
    );
  }
}
