import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { keepLatestTask, task, timeout } from 'ember-concurrency';
import rdflib from 'browser-rdflib';
import { XSD } from '@lblod/submission-form-helpers';
import { scheduleOnce } from '@ember/runloop';

const subsidyBaseUri = 'http://lblod.data.gift/vocabularies/subsidie/ukraine/';

const addressPredicate = new rdflib.NamedNode(
  `${subsidyBaseUri}address`
);
const bedroomCountPredicate = new rdflib.NamedNode(
  `${subsidyBaseUri}bedroomCount`
);
const sharedInvoicePredicate = new rdflib.NamedNode(
  `${subsidyBaseUri}sharedInvoice`
);
const filesPredicate = new rdflib.NamedNode(
  `${subsidyBaseUri}hasFiles`
);

const hasInvalidRowPredicate = new rdflib.NamedNode(
  `${subsidyBaseUri}hasInvalidAccountabilityTableEntry`
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

  sharedInvoiceOptions = ["Ja", "Nee"];

  @tracked address;
  @tracked addressesWithBus;
  @tracked bedroomCount;
  @tracked sharedInvoice;
  @tracked files;

  @tracked addressErrors = [];
  @tracked addressesWithBusErrors = [];
  @tracked bedroomCountErrors = [];
  @tracked sharedInvoiceErrors = [];

  get storeOptions() {
    return this.args.storeOptions;
  }

  get tableSubject() {
    return this.args.tableSubject;
  }

  get tableEntrySubject() {
    return this.args.tableEntrySubject;
  }

  get onUpdateRow() {
    return this.args.onUpdateRow;
  }

  constructor() {
    super(...arguments);
    scheduleOnce('actions', this, this.initializeTableRow);
  }

  initializeTableRow() {
    this.loadProvidedValue();
    this.validate();
  }

  async loadProvidedValue() {

    const entryProperties = this.storeOptions.store.match(
      this.tableEntrySubject,
      undefined,
      undefined,
      this.storeOptions.sourceGraph
    );
      
    const fileEntryProperties = this.storeOptions.store.match(
      this.tableEntrySubject,
      filesPredicate,
      undefined,
      this.storeOptions.sourceGraph
    );

    this.address = this.findEntry(entryProperties, addressPredicate, "");
    this.bedroomCount = this.findEntry(entryProperties, bedroomCountPredicate, 0);
    this.sharedInvoice = this.findEntry(entryProperties, sharedInvoicePredicate, "");
    this.files = await this.parseFileEntry(fileEntryProperties);
  }

  findEntry(entryProperties, predicate, defaultValue) {
    return entryProperties.find(
      (entry) => entry.predicate.value == predicate.value)?.object.value || defaultValue;
  }

  async parseFileEntry(fileProperties) {
    const files = [];
    for (const file of fileProperties) {
      const fileUri = file.object.value;
      const fileObject = await this.retrieveFileField(fileUri)
      files.push(fileObject);
    }
    return files;
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

  @keepLatestTask
  *search(searchData) {
    yield timeout(400);
    const addressSuggestions = yield this.addressregister.suggest(searchData);
    return addressSuggestions;
  }

  updateTripleObject(subject, predicate, newObject = null) {
    const triples = this.storeOptions.store.match(
      subject,
      predicate,
      undefined,
      this.storeOptions.sourceGraph
    );

    this.storeOptions.store.removeStatements([...triples]);

    if (newObject) {
      this.storeOptions.store.addAll([
        {
          subject: subject,
          predicate: predicate,
          object: newObject,
          graph: this.storeOptions.sourceGraph,
        },
      ]);
    }
  }

  @action
  async addFile(fileId) {
    let file = await this.store.findRecord('file', fileId);
    this.storeOptions.store.addAll([
      {
        subject: this.tableEntrySubject,
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
      subject: this.tableEntrySubject,
      predicate: filesPredicate,
      object: new rdflib.NamedNode(file.uri),
      graph: this.storeOptions.sourceGraph,
    }]);
  }

  @action
  removeEntry() {
    const propertyTriples = this.storeOptions.store.match(
      this.tableEntrySubject,
      undefined,
      undefined,
      this.storeOptions.sourceGraph
    );

    this.storeOptions.store.removeStatements(propertyTriples);

    this.args.onRemove(this.tableEntrySubject)
  }

  async checkForBusNummer(addressSuggestion) {
    this.addressesWithBus = [];
    
    const addresses = await this.addressregister.findAll(addressSuggestion);
    if (addresses.length == 1) return;
    const sortedBusNumbers = addresses.sortBy('busnumber');
    this.addressesWithBus = sortedBusNumbers;
  }

  @action
  async updateAddress(value) {
    this.address = value?.fullAddress;

    if(this.address) {
      await this.checkForBusNummer(value);
    }

    this.validate();
  }

  @action
  updateAddressWithBus(value) {
    this.addressesWithBus = [];
    this.address = value?.fullAddress;
    this.validate();
  }

  @action
  updateSharedInvoice(value) {
    this.sharedInvoice = value;
    this.validate();
  }

  validateAddress() {
    this.addressErrors = [];

    if (!this.address) {
      this.addressErrors.pushObject({
        message: 'Adres is verplicht.',
      });
    }
  }

  validateAddressWithBus() {
    this.addressesWithBusErrors = [];

    if (this.addressesWithBus?.length) {
      this.addressesWithBusErrors.pushObject({
        message: 'Het busnummer voor dit adres is verplicht.',
      });
    }
  }

  validateBedroomCount() {
    this.bedroomCountErrors = [];

    if (parseInt(this.bedroomCount) <= 0) {
      this.bedroomCountErrors.pushObject({
        message: 'Het aantal slaapkamers moet groter zijn dan 0.',
      });
    }

    if (!this.isValidInteger(Number(this.bedroomCount))) {
      this.bedroomCountErrors.pushObject({
        message: 'Het aantal slaapkamers moet een geheel getal zijn.',
      });
    }
  }

  validateSharedInvoice() {
    this.sharedInvoiceErrors = [];
    if (!this.sharedInvoice) {
      this.sharedInvoiceErrors.pushObject({
        message: 'Dit veld is verplicht.',
      });
    }
  }


  @action
  validate(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();

    const invalidRowTriple = [{
      subject: this.tableSubject,
      predicate: hasInvalidRowPredicate,
      object: this.tableEntrySubject,
      graph: this.storeOptions.sourceGraph,
    }]

    this.storeOptions.store.addAll(invalidRowTriple)

    /**Validation start */
    this.validateAddress();
    this.validateAddressWithBus();
    this.validateBedroomCount();
    this.validateSharedInvoice();

    if (this.addressErrors.length) return this.onUpdateRow();
    if (this.addressesWithBusErrors.length) return this.onUpdateRow();
    if (this.bedroomCountErrors.length) return this.onUpdateRow();
    if (this.sharedInvoiceErrors.length) return this.onUpdateRow();
    /**Validation end */

    this.updateTripleObject(
      this.tableEntrySubject,
      addressPredicate,
      rdflib.literal(this.address, XSD('string'))
    );

    this.updateTripleObject(
      this.tableEntrySubject,
      bedroomCountPredicate,
      rdflib.literal(this.bedroomCount, XSD('integer'))
    );
    this.updateTripleObject(
      this.tableEntrySubject,
      sharedInvoicePredicate,
      rdflib.literal(this.sharedInvoice, XSD('string'))
    );

    this.storeOptions.store.removeStatements(invalidRowTriple);

    return this.onUpdateRow();
  }

  isPositiveInteger(value) {
    return parseInt(value) >= 0;
  }

  isValidInteger(value) {
    return value % 1 === 0;
  }
}
