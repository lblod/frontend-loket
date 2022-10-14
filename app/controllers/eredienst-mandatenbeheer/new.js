import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';
import { validateMandaat } from 'frontend-loket/models/worship-mandatee';
import { setExpectedEndDate } from 'frontend-loket/utils/eredienst-mandatenbeheer';

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
  createNewPerson(queryParams) {
    if (queryParams.filter) {
      const {
        achternaam,
        'gebruikte-voornaam': gebruikteVoornaam,
        identificator,
      } = queryParams.filter;
      this.router.transitionTo('eredienst-mandatenbeheer.new-person', {
        queryParams: {
          firstName: gebruikteVoornaam,
          lastName: achternaam,
          rijksregisternummer: identificator,
        },
      });
    } else {
      this.router.transitionTo('eredienst-mandatenbeheer.new-person');
    }
  }

  @action
  cancel() {
    this.router.transitionTo('eredienst-mandatenbeheer.mandatarissen');
  }

  @action
  setMandaat(mandaat) {
    const { worshipMandatee } = this.model;
    worshipMandatee.bekleedt = mandaat;
    worshipMandatee.errors.remove('bekleedt');
    setExpectedEndDate(this.store, worshipMandatee, mandaat);
  }

  @action
  handleDateChange(type, isoDate, date) {
    const { worshipMandatee } = this.model;
    worshipMandatee[type] = date;
    let { einde, start } = worshipMandatee;
    if (einde instanceof Date && start instanceof Date) {
      if (einde <= start) {
        worshipMandatee.errors.add(
          'einde',
          'De einddatum moet na de startdatum liggen'
        );
      } else {
        worshipMandatee.errors.remove('einde');
      }
    }
  }

  @dropTask
  *createMandatee(event) {
    event.preventDefault();

    let { worshipMandatee } = this.model;
    if (!worshipMandatee.start) {
      worshipMandatee.errors.add('start', 'startdatum is een vereist veld.');
    }
    if ((yield validateMandaat(worshipMandatee)) && worshipMandatee.isValid) {
      yield worshipMandatee.save();
      this.router.transitionTo(
        'eredienst-mandatenbeheer.mandataris.edit',
        worshipMandatee.id
      );
    } else {
      return;
    }
  }
}
