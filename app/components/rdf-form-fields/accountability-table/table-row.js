import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { keepLatestTask, task, timeout } from 'ember-concurrency';
import rdflib from 'browser-rdflib';

const filesPredicate = new rdflib.NamedNode(
  'http://mu.semte.ch/vocabularies/ext/hasFiles'
);

export default class RdfFormFieldsAccountabilityTableTableRowComponent extends Component {
  @service() addressregister;
  @service() store;

  @tracked addressesWithBusnumbers;

  @tracked address;
  @tracked busNumber;

  get storeOptions() {
    return this.args.storeOptions;
  }

  get isDisabledBusnumberSelect() {
    return this.addressesWithBusnumbers > 1;
  }

  constructor() {
    super(...arguments)
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

  }

  @action
  updateSharedInvoice(value) {
    const entry = this.args.entry
    entry.sharedInvoice.errors = [];
    entry.sharedInvoice.value = value

    this.args.updateFieldValueTriple(entry, 'sharedInvoice');
  }

  @action
  async addFile(fileId) {
    const accountabilityEntrySubject = this.args.entry.accountabilityEntrySubject;
    let file = await this.store.findRecord('file', fileId);
    this.storeOptions.store.addAll([
      {
        subject: accountabilityEntrySubject,
        predicate: filesPredicate,
        object: new rdflib.NamedNode(file.uri),
        graph: this.storeOptions.sourceGraph,
      },
    ]);
  }

  isEmpty(value) {
    return value.toString().length == 0;
  }
}
