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
  createNewPerson(queryParams) {
    if (queryParams.filter) {
      const {
        achternaam,
        'gebruikte-voornaam': gebruikteVoornaam,
        identificator,
      } = queryParams.filter;
      this.router.transitionTo('worship-ministers-management.new-person', {
        queryParams: {
          firstName: gebruikteVoornaam,
          lastName: achternaam,
          rijksregisternummer: identificator,
        },
      });
    } else {
      this.router.transitionTo('worship-ministers-management.new-person');
    }
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
      } else {
        worshipMinister.errors.remove('agentEndDate');
      }
    }
  }

  @action
  handleFunctieChange(functie) {
    const { worshipMinister } = this.model;
    worshipMinister.ministerPosition = functie;
    worshipMinister.errors.remove('ministerPosition');
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
    if ((yield validateFunctie(worshipMinister)) && worshipMinister.isValid) {
      yield worshipMinister.save();
      this.router.transitionTo(
        'worship-ministers-management.minister.edit',
        worshipMinister.id
      );
    } else {
      return;
    }
  }
}
