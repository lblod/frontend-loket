import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { isBlank } from '@ember/utils';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import {
  getBirthDate,
  isBiologicalFemale,
  isBirthDateKnown,
  isGenderKnown,
  isValidRijksregisternummer,
} from 'frontend-loket/utils/rijksregisternummer';
import moment from 'moment';

const maleId = '5ab0e9b8a3b2ca7c5e000028';
const femaleId = '5ab0e9b8a3b2ca7c5e000029';
const requiredFields = [
  'geslacht',
  'voornaam',
  'familienaam',
  'rijksregisternummer',
];

export default class SharedPersoonCreatePersoonComponent extends Component {
  @service store;

  @tracked geslacht;
  @tracked voornaam = this.args.prefilledValues?.voornaam;
  @tracked familienaam = this.args.prefilledValues?.familienaam;
  @tracked roepnaam;
  @tracked rijksregisternummer = this.args.prefilledValues?.rijksregisternummer;
  @tracked nationaliteit;
  @tracked birthDate;
  @tracked errors;

  male = maleId;
  female = femaleId;

  constructor() {
    super(...arguments);

    const now = new Date();
    const hundredYearsAgo = new Date(
      now.getFullYear() - 100,
      now.getMonth(),
      now.getDate(),
    );
    const eighteenYearsAgo = new Date(
      now.getFullYear() - 18,
      now.getMonth(),
      now.getDate(),
    );

    this.minDate = hundredYearsAgo;
    this.maxDate = eighteenYearsAgo;

    if (this.args.prefilledValues?.rijksregisternummer) {
      this.setRijksregisternummer(
        this.args.prefilledValues?.rijksregisternummer,
      );
    }
  }

  get isNationalityFieldRequired() {
    return !!this.args.nationalityRequired;
  }

  get isGeboorteFieldRequired() {
    return !!this.args.geboorteRequired;
  }

  @task
  *loadOrCreateRijksregister() {
    let identificator;
    let queryResult = yield this.store.query('identificator', {
      filter: { ':exact:identificator': this.rijksregisternummer },
    });

    if (queryResult.length >= 1) {
      identificator = queryResult.at(0);
    } else {
      identificator = yield this.store
        .createRecord('identificator', {
          identificator: this.rijksregisternummer,
        })
        .save();
    }
    return identificator;
  }

  @task
  *loadOrCreateGeboorte() {
    let geboorte;
    let queryResult = yield this.store.query('geboorte', {
      filter: { datum: this.birthDate.toISOString().substring(0, 10) },
    });

    if (queryResult.length >= 1) {
      geboorte = queryResult.at(0);
    } else {
      geboorte = yield this.store
        .createRecord('geboorte', { datum: this.birthDate })
        .save();
    }
    return geboorte;
  }

  @task
  *save() {
    // todo identificator

    let errors = {};

    if (this.isNationalityFieldRequired) requiredFields.push('nationaliteit');

    requiredFields.forEach((field) => {
      if (isBlank(this[field])) {
        errors[field] = `${field} is een vereist veld.`;
      }
    });

    if (!this.birthDate && this.isGeboorteFieldRequired) {
      errors.geboorte = 'geboortedatum is een vereist veld.';
    }

    if (this.birthDate) {
      if (this.birthDate < this.minDate) {
        let minDate = moment(this.minDate).format('DD-MM-YYYY');
        errors.geboorte = `geboortedatum moet na ${minDate} liggen`;
      } else if (this.birthDate > this.maxDate) {
        let maxDate = moment(this.maxDate).format('DD-MM-YYYY');
        errors.geboorte = `geboortedatum moet voor ${maxDate} liggen`;
      }
    }

    if (!isValidRijksregisternummer(this.rijksregisternummer)) {
      errors.rijksregisternummer = 'rijksregisternummer is niet geldig.';
    }

    this.errors = errors;

    let hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) {
      return;
    }

    const store = this.store;
    let persoon;

    try {
      persoon = store.createRecord('persoon', {
        gebruikteVoornaam: this.voornaam,
        achternaam: this.familienaam,
        alternatieveNaam: this.roepnaam,
        geslacht: yield store.findRecord('geslacht-code', this.geslacht),
        identificator: yield this.loadOrCreateRijksregister.perform(),
        geboorte: yield this.loadOrCreateGeboorte.perform(),
      });

      if (this.isNationalityFieldRequired)
        persoon.nationalities = this.nationaliteit;

      yield persoon.save();
      this.args.onCreate?.(persoon);
    } catch {
      this.errors = { save: 'Fout bij verwerking, probeer het later opnieuw.' };
      if (persoon) persoon.destroy();
    }
  }

  @action
  setGender(genderId) {
    this.geslacht = genderId;
  }

  @action
  setDateOfBirth(isoDate, date) {
    this.birthDate = date;
  }

  @action
  handleRijksregisternummerChange(event) {
    const rijksregisternummer = event.target.inputmask.unmaskedvalue();
    this.setRijksregisternummer(rijksregisternummer);
  }

  setRijksregisternummer(rijksregisternummer) {
    this.rijksregisternummer = rijksregisternummer;

    if (isValidRijksregisternummer(rijksregisternummer)) {
      this.birthDate = isBirthDateKnown(rijksregisternummer)
        ? new Date(getBirthDate(rijksregisternummer))
        : this.birthDate;
      if (isGenderKnown(rijksregisternummer)) {
        isBiologicalFemale(rijksregisternummer)
          ? this.setGender(femaleId)
          : this.setGender(maleId);
      }
    }
  }
}
