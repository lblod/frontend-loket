import Component from '@ember/component';
import { empty } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  addressregister: service(),

  isDisabledBusnumberSelect: empty('addressWithBusnumber'),

  address: null,
  onChange: null,

  async init() {
    this._super(...arguments);
    const address = await this.address;

    if (address) {
      this.set('addressSuggestion', this.addressregister.toAddressSuggestion(address));
      const addresses = await this.addressregister.findAll(this.addressSuggestion);
      if (addresses.length > 1) {
        const selectedAddress = addresses.find(a => a.busnumber == address.busnummer);
        this.set('addressesWithBusnumbers', addresses.sortBy('busnumber'));
        this.set('addressWithBusnumber', selectedAddress);
      } else {
        this.set('addressesWithBusnumbers', null);
        this.set('addressWithBusnumber', null);
      }
    }
  },

  selectSuggestion: task(function * (addressSuggestion) {
    this.set('addressesWithBusnumbers', null);
    this.set('addressWithBusnumber', null);
    this.set('addressSuggestion', addressSuggestion);

    if (addressSuggestion) {
      const addresses = yield this.addressregister.findAll(addressSuggestion);
      if (addresses.length == 1) {
        this.onChange(addresses[0].adresProperties);
      } else { // selection of busnumber required
        const sortedBusNumbers = addresses.sortBy('busnumber');
        this.set('addressesWithBusnumbers', sortedBusNumbers);
        this.set('addressWithBusnumber', sortedBusNumbers[0]);
      }
    } else {
      this.onChange(null);
    }
  }),

  search: task(function* (searchData) {
    yield timeout(400);
    const addressSuggestions = yield this.addressregister.suggest(searchData);
    return addressSuggestions;
  }).keepLatest(),

  actions: {
    selectAddressWithBusnumber(address) {
      this.set('addressWithBusnumber', address);
      this.onChange(address.adresProperties);
    }
  }
});
