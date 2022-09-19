import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';

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
    this.model.worshipMandatee.bekleedt = mandaat;
    this.setExpectedEndDate(
      await this.fetchBestuursorganenInTijd(mandaat),
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

  async setExpectedEndDate(bestuursorganenInTijd, mandaat) {
    if (
      mandaat.get('bestuursfunctie.label') ===
      'Bestuurslid (van rechtswege) van het bestuur van de eredienst'
    ) {
      this.model.worshipMandatee.expectedEndDate = undefined; // Bestuurslid (van rechtswege) is a lifetime mandate
    } else {
      let plannedEndDates = bestuursorganenInTijd.map((o) => o.bindingEinde);
      this.model.worshipMandatee.expectedEndDate = !plannedEndDates
        ? undefined
        : plannedEndDates[0];
    }
  }
}
