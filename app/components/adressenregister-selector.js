import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { keepLatestTask, task, timeout } from 'ember-concurrency';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class AdressenregisterSelectorComponent extends Component {
  @service() addressregister;

  @tracked address = null;
  @tracked addressSuggestion;
  @tracked addressesWithBusnumbers;
  @tracked addressWithBusnumber;

  constructor() {
    super(...arguments);
    this.getAddressInfo();
  }

  get isDisabledBusnumberSelect() {
    return !this.addressWithBusnumber;
  }

  async getAddressInfo() {
    const address = await this.args.address;
    if (address) {
      this.addressSuggestion =
        await this.addressregister.toAddressSuggestion(address);
      const addresses = await this.addressregister.findAll(
        this.addressSuggestion,
      );
      if (addresses.length > 1) {
        const selectedAddress = addresses.find(
          (a) => a.busnumber == address.busnummer,
        );
        this.addressesWithBusnumbers = sortByBusnumber(addresses);
        this.addressWithBusnumber = selectedAddress;
      } else {
        this.addressesWithBusnumbers = null;
        this.addressWithBusnumber = null;
      }
    }
  }

  @task
  *selectSuggestion(addressSuggestion) {
    this.addressesWithBusnumbers = null;
    this.addressWithBusnumber = null;
    this.addressSuggestion = addressSuggestion;

    if (addressSuggestion) {
      const addresses = yield this.addressregister.findAll(addressSuggestion);
      if (addresses.length == 1) {
        this.args.onChange(addresses[0].adresProperties);
      } else {
        // selection of busnumber required
        const sortedBusNumbers = sortByBusnumber(addresses);
        this.addressesWithBusnumbers = sortedBusNumbers;
        this.addressWithBusnumber = sortedBusNumbers[0];
        this.args.onChange(this.addressWithBusnumber.adresProperties);
      }
    } else {
      this.args.onChange(null);
    }
  }

  @keepLatestTask
  *search(searchData) {
    yield timeout(400);
    const addressSuggestions = yield this.addressregister.suggest(searchData);
    return addressSuggestions;
  }

  @action
  selectAddressWithBusnumber(address) {
    this.addressWithBusnumber = address;
    this.args.onChange(address.adresProperties);
  }
}

/**
 * @param {{busnumber: string | null}[]} arrayToSort
 * @returns {{busnumber: string | null}[]}
 */
function sortByBusnumber(arrayToSort) {
  return arrayToSort.slice().sort((a, b) => {
    if (!a.busnumber) {
      return -1;
    }

    return a.busnumber.localeCompare(b.busnumber);
  });
}
