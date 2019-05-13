import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { A } from '@ember/array';
import { isBlank } from '@ember/utils';
import { computed } from '@ember/object';
import { equal } from '@ember/object/computed';
const maleId = '5ab0e9b8a3b2ca7c5e000028';
const femaleId = '5ab0e9b8a3b2ca7c5e000029';
const CreatePersoon = Component.extend({
  tagName: '',
  store: service(),
  router: service(),
  init() {
    this._super(...arguments);
    this.set('errorMessages', A());
    const now = new Date();
    const eighteenYearsAgo = `${now.getDay()}-${now.getMonth()}-${now.getFullYear() - 18}`;
    const hundredYearsAgo = `${now.getDay()}-${now.getMonth()}-${now.getFullYear() - 100}`;
    this.set('maxDate', eighteenYearsAgo);
    this.set('minDate', hundredYearsAgo);
    this.set('birthDate', new Date(now.getFullYear()-21,now.getMonth(), now.getDay()));
  },

  isMale: equal('geslacht', maleId),
  isFemale: equal('geslacht', femaleId),
  /**
   * check if rijksregisternummer is valid
   */
  isValidRijksRegister: computed('rijksregisternummer', function() {
    let rr = this.rijksregisternummer;
    if (isBlank(rr))
      return false;
    if (rr.length != 11) {
      return false;
    }
    const preNillies = parseInt(rr.slice(9,11)) === 97 - (parseInt(rr.slice(0,9)) % 97);
    const postNillies = parseInt(rr.slice(9,11)) === 97 - ((2000000000 + parseInt(rr.slice(0,9))) % 97);
    return preNillies || postNillies;
  }),
  /**
   *
   */
  loadOrCreateRijksregister: task( function * () {
    const store = this.store;
    let identificator;
    let queryResult = yield store.query('identificator', {filter: {':exact:identificator': this.rijksregisternummer}});
    if (queryResult.length >= 1)
      identificator = queryResult.get('firstObject');
    else {
      identificator = yield store.createRecord('identificator', {identificator: this.rijksregisternummer}).save();
    }
    return identificator;
  }),
  loadOrCreateGeboorte: task( function * () {
    const store = this.store;
    let geboorte;
    let queryResult = yield store.query('geboorte', {filter: {'datum': this.birthDate.toISOString().substring(0, 10)}});
    if (queryResult.length >= 1)
      geboorte = queryResult.get('firstObject');
    else {
      geboorte = yield store.createRecord('geboorte', {datum: this.birthDate}).save();
    }
    return geboorte;
  }),
  save: task( function * () {
    // todo geboorte en identificator
    this.set('hasError', false);
    this.requiredFields.forEach((field) => {
      this.set(`${field}Error`, null);
      if (isBlank(this.get(field))) {
        this.set('hasError', true);
        this.set(`${field}Error`,`${field} is een vereist veld.`);
      }
    });
    if (! this.isValidRijksRegister) {
      this.set('rijksregisternummerError', 'rijksregisternummer is niet geldig.');
    }
    if (this.hasError)
      return;
    const store = this.store;
    let persoon;
    this.set('saveError', '');
    try {
      persoon = store.createRecord('persoon', {
        gebruikteVoornaam: this.voornaam,
        achternaam: this.familienaam,
        alternatieveNaam: this.roepnaam,
        geslacht: yield store.findRecord('geslacht-code', this.geslacht),
        identificator: yield this.loadOrCreateRijksregister.perform(),
        geboorte: yield this.loadOrCreateGeboorte.perform()
      });
      const result = yield persoon.save();
      this.onCreate(result);
    }
    catch(e) {
      this.set('saveError','Fout bij verwerking, probeer het later opnieuw.');
      if (persoon) persoon.destroy();
    }
  }),
  actions: {
    setGender(event) {
      this.set('geslacht', event.target.value);
    },
  }
});

CreatePersoon.reopen({
  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
  requiredFields: [ 'geslacht', 'voornaam', 'familienaam', "rijksregisternummer" ],
  male: maleId,
  female: femaleId
});
export default CreatePersoon;