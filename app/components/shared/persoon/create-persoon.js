import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { isBlank } from '@ember/utils';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';

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
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth()}`.padStart(2, 0);
    const eighteenYearsAgo = `${now.getFullYear() - 18}-${month}-${day}`;
    const hundredYearsAgo = `${now.getFullYear() - 100}-${month}-${day}`;

    this.minDate = hundredYearsAgo;
    this.maxDate = eighteenYearsAgo;

    this.birthDate = new Date(
      now.getFullYear() - 21,
      now.getMonth(),
      now.getDay()
    );
  }

  get isMale() {
    return this.geslacht === maleId;
  }

  get isFemale() {
    return this.geslacht === femaleId;
  }

  get isValidRijksregisternummer() {
    let rr = this.rijksregisternummer;
    if (isBlank(rr)) return false;
    if (rr.length != 11) {
      return false;
    }
    const preNillies =
      parseInt(rr.slice(9, 11)) === 97 - (parseInt(rr.slice(0, 9)) % 97);
    const postNillies =
      parseInt(rr.slice(9, 11)) ===
      97 - ((2000000000 + parseInt(rr.slice(0, 9))) % 97);

    return preNillies || postNillies;
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
      identificator = queryResult.get('firstObject');
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
      geboorte = queryResult.get('firstObject');
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

    if (!this.isValidRijksregisternummer) {
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
    } catch (e) {
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
}
