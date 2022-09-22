import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';
import {
  fetchBestuursorganenInTijd,
  setExpectedEndDate,
} from 'frontend-loket/utils/eredienst-mandatenbeheer';

export default class EredienstMandatenbeheerNewController extends Controller {
  @service router;
  @service store;

  queryParams = ['personId'];
  @tracked personId = '';

  get shouldSelectPerson() {
    return !this.model?.person;
  }

  @action
  selectPersoon(person) {
    this.router.transitionTo({ queryParams: { personId: person.id } });
  }

  @action
  createNewPerson() {
    this.router.transitionTo('eredienst-mandatenbeheer.new-person');
  }

  @action
  cancel() {
    this.router.transitionTo('eredienst-mandatenbeheer.mandatarissen');
  }

  @action
  async setMandaat(mandaat) {
    const { worshipMandatee } = this.model;
    worshipMandatee.bekleedt = mandaat;
    setExpectedEndDate(
      await fetchBestuursorganenInTijd(this.store, mandaat.uri),
      worshipMandatee,
      mandaat
    );
  }

  @action
  handleDateChange(type, isoDate, date) {
    this.model.worshipMandatee[type] = date;
  }

  @dropTask
  *createMandatee(event) {
    event.preventDefault();

    let { worshipMandatee } = this.model;
    yield worshipMandatee.save();

    this.router.transitionTo(
      'eredienst-mandatenbeheer.mandataris.edit',
      worshipMandatee.id
    );
  }
}
