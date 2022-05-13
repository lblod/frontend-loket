import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { keepLatestTask, task, timeout } from 'ember-concurrency';
import rdflib from 'browser-rdflib';
import { A } from '@ember/array';

const filesPredicate = new rdflib.NamedNode(
  'http://mu.semte.ch/vocabularies/ext/hasFiles'
);

class FileField {
  @tracked errors = [];

  constructor({ record, errors }) {
    this.record = record;
    this.errors = errors;
  }

  get isValid() {
    return this.errors.length == 0;
  }

  get isInvalid() {
    return !this.isValid;
  }
}

export default class RdfFormFieldsAccountabilityTableTableRowComponent extends Component {
  @service() addressregister;
  @service() store;

  @tracked files;

  @tracked addressesWithBusnumbers;

  @tracked address;
  @tracked busNumber;

  get storeOptions() {
    return this.args.storeOptions;
  }

  get accountabilityEntrySubject() {
    return this.args.entry.accountabilityEntrySubject
  }

  get isDisabledBusnumberSelect() {
    return this.addressesWithBusnumbers > 1;
  }

  constructor() {
    super(...arguments);
    this.files = A(this.args.entry.files);
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
    let file = await this.store.findRecord('file', fileId);
    this.storeOptions.store.addAll([
      {
        subject: this.accountabilityEntrySubject,
        predicate: filesPredicate,
        object: new rdflib.NamedNode(file.uri),
        graph: this.storeOptions.sourceGraph,
      },
    ]);

    this.files.pushObject(await this.retrieveFileField(file.uri))
  }


  async retrieveFileField(uri) {
    try {
      const files = await this.store.query('file', {
        'filter[:uri:]': uri,
        page: { size: 1 },
      });
      const file = files.get('firstObject');
      if (file) return new FileField({ record: file, errors: [] });
      else
        return new FileField({
          record: null,
          errors: ['Geen bestand gevonden'],
        });
    } catch (error) {
      warn(`Failed to retrieve file with URI ${uri}: ${JSON.stringify(error)}`);
      return new FileField({
        record: null,
        errors: ['Ophalen van het bestand is mislukt'],
      });
    }
  }

  @action
  deleteFile(file, index) {
    this.files.removeAt(index);

    this.storeOptions.store.removeStatements([{
      subject: this.accountabilityEntrySubject,
      predicate: filesPredicate,
      object: new rdflib.NamedNode(file.uri),
      graph: this.storeOptions.sourceGraph,
    }]);

  }


  isEmpty(value) {
    return value.toString().length == 0;
  }
}
