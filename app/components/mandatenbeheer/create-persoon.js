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
  init() {
    this._super(...arguments);
    this.set('errorMessages', A());
  },

  isMale: equal('geslacht', maleId),
  isFemale: equal('geslacht', femaleId),
  /**
   * check if rijksregisternummer is valid
   */
  isValidRijksRegister: computed('rijksregisternummer', function() {
    let rr = this.get('rijksregisternummer');
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
    const store = this.get('store');
    let identificator;
    let queryResult = yield store.query('identificator', {filter: {':exact:identificator': this.get('rijksregisternummer')}});
    if (queryResult.length >= 1)
      identificator = queryResult.get('firstObject');
    else {
      identificator = yield store.createRecord('identificator', {identificator: this.get('rijksregisternummer')}).save();
    }
    return identificator;
  }),
  loadOrCreateGeboorte: task( function * () {
    const store = this.get('store');
    let geboorte;
    let queryResult = yield store.query('geboorte', {filter: {'datum': this.get('birthDate').toISOString().substring(0, 10)}});
    if (queryResult.length >= 1)
      geboorte = queryResult.get('firstObject');
    else {
      geboorte = yield store.createRecord('geboorte', {datum: this.get('birthDate')}).save();
    }
    return geboorte;
  }),
  save: task( function * () {
    // todo geboorte en identifcator
    this.set('errorMessages', A());
    this.get('requiredFields').forEach((field) => {
      if (!this.get(field)) {
        this.get('errorMessages').pushObject(`${field} is een vereist veld.`);
      }
    });
    if (! this.get('isValidRijksRegister')) {
      this.get('errorMessages').pushObject('rijksregisternummer is niet geldig.');
    }
    if (this.get('errorMessages').length > 0)
      return;
    const store = this.get('store');
    const persoon = store.createRecord('persoon', {
      gebruikteVoornaam: this.get('voornaam'),
      achternaam: this.get('achternaam'),
      alternatieveNaam: this.get('roepnaam'),
      geslacht: yield store.findRecord('geslacht-code', this.get('geslacht')),
      identificator: yield this.get('loadOrCreateRijksregister').perform(),
      geboorte: yield this.get('loadOrCreateGeboorte').perform()
    });
    try {
      const result = yield persoon.save();
      this.get('onCreate')(result);
    }
    catch(e) {
      console.log(e);
      persoon.destroy();
    }
  }),
  actions: {
    setGender(event) {
      this.set('geslacht', event.target.value);
    }
  }
});

CreatePersoon.reopen({
  requiredFields: [ 'geslacht', 'voornaam', 'achternaam', "rijksregisternummer" ]
});
export default CreatePersoon;
