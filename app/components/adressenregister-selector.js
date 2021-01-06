import Component from '@ember/component';
import { empty } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class AdressenregisterSelectorComponent extends Component {
  @service() addressregister;

  @empty('addressWithBusnumber') isDisabledBusnumberSelect;

  @tracked address = null;
  @tracked onChange = null;
  @tracked addressSuggestion;
  @tracked addressesWithBusnumbers;
  @tracked addressWithBusnumber;
  @tracked addressesWithBusnumbers;

  constructor() {
    super(...arguments);
    this.getAddressInfo();
  }

  async getAddressInfo() {
    const address = await this.address;
    if (address) {
      this.addressSuggestion = await this.addressregister.toAddressSuggestion(address);
      const addresses = await this.addressregister.findAll(this.addressSuggestion);
      if (addresses.length > 1) {
        const selectedAddress = addresses.find(a => a.busnumber == address.busnummer);
        this.addressesWithBusnumbers = addresses.sortBy('busnumber');
        this.addressWithBusnumber = selectedAddress;
      } else {
        this.addressesWithBusnumbers = null;
        this.addressWithBusnumber = null;
      }
    }
  }

  @task(function * (addressSuggestion) {
    this.addressesWithBusnumbers = null;
    this.addressWithBusnumber = null;
    this.addressSuggestion = addressSuggestion;

    if (addressSuggestion) {
      const addresses = yield this.addressregister.findAll(addressSuggestion);
      if (addresses.length == 1) {
        this.onChange(addresses[0].adresProperties);
      } else { // selection of busnumber required
        const sortedBusNumbers = addresses.sortBy('busnumber');
        this.addressesWithBusnumbers = sortedBusNumbers;
        this.addressWithBusnumber = sortedBusNumbers[0];
        this.onChange(this.addressWithBusnumber.adresProperties);
      }
    } else {
      this.onChange(null);
    }
  }) selectSuggestion;

  @task(function* (searchData) {
    yield timeout(400);
    const addressSuggestions = yield this.addressregister.suggest(searchData);
    return addressSuggestions;
  }).keepLatest() search;

  @action
    selectAddressWithBusnumber(address) {
      this.addressWithBusnumber = address;
      this.onChange(address.adresProperties);
    }
}