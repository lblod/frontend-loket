import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { keepLatestTask, task, timeout } from 'ember-concurrency';

export default class RdfFormFieldsAccountabilityTableTableRowComponent extends Component {
  @service() addressregister;

  @tracked addressesWithBusnumbers;

  @tracked address;
  @tracked busNumber;

  get isDisabledBusnumberSelect() {
    return this.addressesWithBusnumbers > 1;
  }

  @keepLatestTask
  *search(searchData) {
    yield timeout(400);
    const addressSuggestions = yield this.addressregister.suggest(searchData);
    return addressSuggestions;
  }

  @task
  *selectAddress(value) {
    const entry = this.args.entry

    entry.address.errors = [];
    entry.address.value = value?.fullAddress || "";

    if (this.isEmpty(entry.address.value)) {
      entry.address.errors.pushObject({
        message: 'Adres is verplicht.',
      });
    }

    this.args.updateFieldValueTriple(entry, 'address');

    this.args.validate();
  }


  @action
  updateBedroomCount() {
    const entry = this.args.entry
    entry.bedroomCount.errors = [];
    const parsedValue = parseInt(entry.bedroomCount.value);
    entry.bedroomCount.value = !isNaN(parsedValue)
      ? parsedValue
      : entry.bedroomCount.value;

    this.args.updateFieldValueTriple(entry, 'bedroomCount');

    this.args.validate();
  }


  @action
  updateSharedInvoice(value) {
    const entry = this.args.entry
    entry.sharedInvoice.errors = [];
    entry.sharedInvoice.value = value

    this.args.updateFieldValueTriple(entry, 'sharedInvoice');

    this.args.validate();
  }


  @action
  debug() {
    console.log("debug")
  }

  isEmpty(value) {
    return value.toString().length == 0;
  }
}
