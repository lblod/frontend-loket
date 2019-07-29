import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { task } from 'ember-concurrency';

const emptyAdresRegister = {
  land: null,
  gemeente: null,
  postcode: null,
  adres: null,
  adresRegisterId: null,
  adresRegisterUri: null
}

export default Controller.extend({
  newAddressData: null,
  showConfirmationDialog: false,
  busnummerSelectDisabled: true,

  busnummerSelectPlaceholder: computed('busnummerSelectDisabled', function() {
    if (this.busnummerSelectDisabled) {
      return "Geen busnummer beschikbaar bij dit adres.";
    }
  }),

  isDirty: computed('model.hasDirtyAttributes', 'newAddressData', function() {
    return this.model.hasDirtyAttributes || this.newAddressData;
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
    this.set('newAddressData', null);
    this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen', this.bestuursfunctie.id);
  },

  fetchAddressMatches: task(function* (addressData) {
    if (addressData) {
      this.set('newAddressData', addressData);
      const matchResult = yield fetch(`/adressenregister/match?municipality=${this.newAddressData.Municipality}&zipcode=${this.newAddressData.Zipcode}&thoroughfarename=${this.newAddressData.Thoroughfarename}&housenumber=${this.newAddressData.Housenumber}`);
      if (matchResult.ok) {
        const matchAddresses = yield matchResult.json();
        if (matchAddresses.length > 1) {
          this.set('matchAddresses', matchAddresses.sortBy('busnummer'));
          this.set('busnummerSelectDisabled', false);
        } else {
          this.set('newMatchAddressData', matchAddresses[0]);
          this.set('busnummerSelectDisabled', true);
        }
      }
    }
  }),

  processAddressDetails: task(function* () {
    if (this.newMatchAddressData) {
      const detailResult = yield fetch(`/adressenregister/detail?uri=${this.newMatchAddressData.detail}`);
      if (detailResult.ok) {
        let adresRegister = yield detailResult.json();
        adresRegister = this.extractRelevantInfo(adresRegister);
        this.saveAddress.perform(adresRegister);
      }
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
    },

    addressSelected(addressData) {
      this.fetchAddressMatches.perform(addressData);
    },

    matchAddressSelected(addressData) {
      this.set('newMatchAddressData', addressData);
    }
  }
});
