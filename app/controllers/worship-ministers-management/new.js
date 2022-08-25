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
  @tracked functionId = '';

  @tracked options = this.labels;
  @tracked selected = '';

  // TODO: to refactor
  get labels() {
    return this.model.ministerPositionFunctions.map(({ label }) => {
      return label;
    });
  }

  getWorshipFunctionsAttributes() {
    return this.model.ministerPositionFunctions.map(({ id, label }) => {
      return { label, id };
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
  getWorshipMinisterFunctionId(worshipFunction) {
    const userSelection = this.getWorshipFunctionsAttributes().find(
      ({ label }, obj) => {
        return label === worshipFunction ? obj : '';
      }
    );

    const { id } = userSelection || '';
    this.functionId = id;
  }

  @action
  handleDateChange(type, isoDate, date) {
    this.model.worshipMinister[type] = date;
  }

  // TODO : fix Uncaught (in promise) DOMException: The object could not be cloned.
  @action
  cancel() {
    this.router.transitionTo('worship-ministers-management');
  }

  @dropTask
  *createWorshipMinister(event) {
    event.preventDefault();

    let { worshipMinister, person } = this.model;

    const worshipFunction = this.getWorshipFunction(this.functionId);

    const ministerPosition = this.store.createRecord('minister-position');
    ministerPosition.set('function', worshipFunction);

    yield ministerPosition.save();

    worshipMinister.ministerPosition = ministerPosition;
    worshipMinister.person = person;

    yield worshipMinister.save();

    this.router.transitionTo(
      'worship-ministers-management.minister.edit',
      worshipMinister.id
    );
  }

  getWorshipFunction(worshipFunctionId) {
    return this.store.peekRecord(
      'minister-position-function',
      worshipFunctionId
    );
  }
}
