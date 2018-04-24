import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { A } from '@ember/array';
const CreatePersoon = Component.extend({
  store: service(),
  classNames: ['mandate-new-info'],
  init() {
    this._super(...arguments);
    this.set('errorMessages', A());
    this.get('loadGenders').perform();
  },
  loadGenders: task( function * () {
    const result = yield this.get('store').findAll('geslacht-code');
    this.set('genders', result);
  }),
  save: task( function * () {
    // todo geboorte en identifcator
    this.set('errorMessages', A());
    this.get('requiredFields').forEach((field) => {
      if (!this.get(field)) {
        this.get('errorMessages').pushObject(`${field} is een vereist veld.`);
      }
    });
    if (this.get('errorMessages').length > 0)
      return;
    const persoon = this.get('store').createRecord('persoon', {
      gebruikteVoornaam: this.get('voornaam'),
      achternaam: this.get('achternaam'),
      alternatieveNaam: this.get('roepnaam'),
      geslacht: this.get('geslacht')
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
    selectGender(gender) {
      this.set('geslacht', gender);
    }
  }
});

CreatePersoon.reopen({
  requiredFields: ['geslacht', 'voornaam', 'achternaam', "rijksregisternummer" ]
})
export default CreatePersoon;
