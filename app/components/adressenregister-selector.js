import Component from '@ember/component';
import { computed }  from '@ember/object';
import { task, timeout } from 'ember-concurrency';
import fetch from 'fetch';

export default Component.extend({
  busnummerSelectDisabled: computed('matchAddresses.[]', function() {
    if (this.matchAddresses) {
      return this.matchAddresses.length <= 1;
    } else {
      return true;
    }
  }),

  busnummerSelectPlaceholder: computed('busnummerSelectDisabled', function() {
    if (this.busnummerSelectDisabled) {
      return "Geen busnummer beschikbaar bij dit adres.";
    }
  }),

  async init() {
    this._super(...arguments);
    if(this.adres.get('volledigAdres')) {
      this.set('selectedAddress', { FormattedAddress : await this.adres.get('volledigAdres') });
    }
  },

  fetchAddressMatches: task(function* (addressData) {
    this.set('isNewAddress', true);
    this.set('busnumberAddress', null);
    this.set('selectedAddress', addressData);
    if (addressData) {
      const matchResult = yield fetch(`/adressenregister/match?municipality=${addressData.Municipality}&zipcode=${addressData.Zipcode}&thoroughfarename=${addressData.Thoroughfarename}&housenumber=${addressData.Housenumber}`);
      if (matchResult.ok) {
        const matchAddresses = yield matchResult.json();
        this.set('matchAddresses', matchAddresses.sortBy('busnummer'));
        if (matchAddresses.length <= 1) {
          this.set('matchedAddress', matchAddresses[0]);
        }
      }
    }
  }),

  search: task(function* (searchData) {
    yield timeout(400);
    const result =  yield fetch(`/adressenregister/search?query=${searchData}`);
    if (result.ok){
      const addresses = yield result.json();
      return addresses['adressen'];
    }
    return [];
  }).keepLatest(),

  actions: {
    matchAddressSelected(addressData) {
      this.set('matchedAddress', addressData);
    },

    select(addressData) {
      this.fetchAddressMatches.perform(addressData);
    }
  }
});
