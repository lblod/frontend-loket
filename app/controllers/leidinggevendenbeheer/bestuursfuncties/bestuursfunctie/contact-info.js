import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { task } from 'ember-concurrency';

const emptyAdresRegister = {
  land: null,
  gemeente: null,
  postcode: null,
  adres: null,
  adresRegisterId: null,
  adresRegisterUri: null,
  volledigAdres: null,
}

export default Controller.extend({
  matchedAddress: null,
  isNewAddress: false,
  showConfirmationDialog: false,

  isDirty: computed('model.hasDirtyAttributes', 'isNewAddress', 'matchedAddress', function() {
    return this.model.hasDirtyAttributes || this.isNewAddress || this.matchedAddress;
  }),

  extractRelevantInfo(adresRegister) {
    return {
      land: null, //seriously no land?
      gemeente: adresRegister['gemeente']['gemeentenaam']['geografischeNaam']['spelling'],
      postcode: adresRegister['postinfo']['objectId'],
      volledigAdres: adresRegister['volledigAdres']['geografischeNaam']['spelling'],
      adresRegisterId: adresRegister['identificator']['objectId'],
      adresRegisterUri: adresRegister['identificator']['id']
    };
  },

  exit() {
    this.set('showConfirmationDialog', false);
    this.set('isNewAddress', false);
    this.set('matchedAddress', null);
    this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen', this.bestuursfunctie.id);
  },

  processAddressDetails: task(function* () {
    if (this.matchedAddress) {
      const detailResult = yield fetch(`/adressenregister/detail?uri=${this.matchedAddress.detail}`);
      if (detailResult.ok) {
        let adresRegister = yield detailResult.json();
        adresRegister = this.extractRelevantInfo(adresRegister);
        this.saveAddress.perform(adresRegister);
      }
    } else {
      this.saveAddress.perform(null);
    }
  }),

  saveAddress: task(function* (adresRegister) {
    let adres = yield this.model.adres;
    if (adresRegister) {
      adres.setProperties(adresRegister);
    } else {
      adres.setProperties(emptyAdresRegister);
    }
    yield adres.save();

    this.model.set('adres', adres);
    yield this.model.save();

    this.exit();
  }),

  actions: {
    async save() {
      await this.processAddressDetails.perform();
    },

    cancel() {
      if (!this.isDirty)
        this.exit();
      else
        this.set('showConfirmationDialog', true);
    },

    resetChanges() {
      this.model.rollbackAttributes();
      this.exit();
    }
  }
});
