import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { keepLatestTask, task, timeout } from 'ember-concurrency';
import { triplesForPath, XSD } from '@lblod/submission-form-helpers';
import rdflib from 'browser-rdflib';
import { v4 as uuidv4 } from 'uuid';
import { RDF } from '@lblod/submission-form-helpers';
import { next } from '@ember/runloop';
import { guidFor } from '@ember/object/internals';

const MU = new rdflib.Namespace('http://mu.semte.ch/vocabularies/core/');

const accountabilityTableBaseUri =
  'http://data.lblod.info/accountability-tables';
const accountabilityEntryBaseUri =
  'http://data.lblod.info/accountability-entries';
const lblodSubsidieBaseUri = 'http://lblod.data.gift/vocabularies/subsidie/';
const extBaseUri = 'http://mu.semte.ch/vocabularies/ext/';

const AccountabilityTableType = new rdflib.NamedNode(
  `${lblodSubsidieBaseUri}AccountabilityTable`
);
const ApplicationFormEntryType = new rdflib.NamedNode(
  `${extBaseUri}ApplicationFormEntry`
);
const accountabilityTablePredicate = new rdflib.NamedNode(
  `${lblodSubsidieBaseUri}accountabilityTable`
);
const accountabilityEntryPredicate = new rdflib.NamedNode(
  `${extBaseUri}accountabilityEntry`
);
const addressPredicate = new rdflib.NamedNode(
  'http://mu.semte.ch/vocabularies/ext/address'
);
const bedroomCountPredicate = new rdflib.NamedNode(
  'http://mu.semte.ch/vocabularies/ext/bedroomCount'
);
const sharedInvoicePredicate = new rdflib.NamedNode(
  'http://mu.semte.ch/vocabularies/ext/sharedInvoice'
);
const createdPredicate = new rdflib.NamedNode(
  'http://purl.org/dc/terms/created'
);

const LBLOD_SUBSIDIE = new rdflib.Namespace(
  'http://lblod.data.gift/vocabularies/subsidie/'
);

const inputFieldNames = [
  'address',
  'addressPrefLabel',
  'bedroomCount',
  'sharedInvoice',
];

class EntryProperties {
  @tracked value;
  @tracked oldValue;
  @tracked errors = [];

  constructor(value, predicate) {
    this.value = value;
    this.oldValue = value;
    this.predicate = predicate;
    this.errors = [];
  }
}

class ApplicationFormEntry {
  @tracked accountabilityEntrySubject;

  constructor({
    accountabilityEntrySubject,
    address,
    bedroomCount,
    sharedInvoice,
    created,
  }) {
    this.accountabilityEntrySubject = accountabilityEntrySubject;

    this.address = new EntryProperties(address, addressPredicate);
    this.bedroomCount = new EntryProperties(
      bedroomCount,
      bedroomCountPredicate
    );
    this.sharedInvoice = new EntryProperties(
      sharedInvoice,
      sharedInvoicePredicate
    );
    this.created = new EntryProperties(created, createdPredicate);
  }
}

export default class RdfFormFieldsAccountabilityTableEditComponent extends InputFieldComponent {
  id = `accountability-table-${guidFor(this)}`;
  
  @service() addressregister;

  @tracked accountabilityTableSubject = null;
  @tracked entries = [];

  constructor() {
    super(...arguments);
    this.loadProvidedValue();

    // Add an entry by default as an example
    next(this, () => {
      if (this.entries.length == 0) {
        this.addEntry();
        this.hasBeenFocused = false;
      }
    });
  }

  get hasAccountabilityTable() {
    if (!this.accountabilityTableSubject) {
      return false;
    } else {
      return (
        this.storeOptions.store.match(
          this.sourceNode,
          accountabilityTablePredicate,
          this.accountabilityTableSubject,
          this.storeOptions.sourceGraph
        ).length > 0
      );
    }
  }

  get hasEntries() {
    return (
      this.storeOptions.store.match(
        this.accountabilityTableSubject,
        accountabilityEntryPredicate,
        undefined,
        this.storeOptions.sourceGraph
      ).length > 0
    );
  }

  get sortedEntries() {
    return this.entries.sort((a, b) =>
      a.created.value.localeCompare(b.created.value)
    );
  }

  loadProvidedValue() {
    const matches = triplesForPath(this.storeOptions);
    const triples = matches.triples;

    if (triples.length == 0) return;

    this.accountabilityTableSubject = triples[0].object; // assuming only one per form

    const entriesMatches = triplesForPath({
      store: this.storeOptions.store,
      path: accountabilityEntryPredicate,
      formGraph: this.storeOptions.formGraph,
      sourceNode: this.accountabilityTableSubject,
      sourceGraph: this.storeOptions.sourceGraph,
    });

    const entriesTriples = entriesMatches.triples;

    if (entriesTriples.length <= 0) return;

    for (const entry of entriesTriples) {
      const entryProperties = this.storeOptions.store.match(
        entry.object,
        undefined,
        undefined,
        this.storeOptions.sourceGraph
      );

      const parsedEntry = this.parseEntryProperties(entryProperties);

      const newEntry = new ApplicationFormEntry({
        accountabilityEntrySubject: entry.object,
        address: parsedEntry.address ? parsedEntry.address : '',
        bedroomCount: parsedEntry.bedroomCount
          ? parsedEntry.bedroomCount
          : 0,
        sharedInvoice: parsedEntry.sharedInvoice
          ? parsedEntry.sharedInvoice
          : false,
        created: parsedEntry.created,
      })

      this.entries.pushObject(newEntry);
    }
  }

  /**
   * Parse entry properties from triples to a simple object with the triple values
   */
  parseEntryProperties(entryProperties) {
    let entry = {};
    if (
      entryProperties.find(
        (entry) => entry.predicate.value == addressPredicate.value
      )
    )
      entry.address = entryProperties.find(
        (entry) => entry.predicate.value == addressPredicate.value
      ).object.value;
    if (
      entryProperties.find(
        (entry) =>
          entry.predicate.value == bedroomCountPredicate.value
      )
    )
      entry.bedroomCount = entryProperties.find(
        (entry) =>
          entry.predicate.value == bedroomCountPredicate.value
      ).object.value;
    if (
      entryProperties.find(
        (entry) =>
          entry.predicate.value == sharedInvoicePredicate.value
      )
    )
      entry.sharedInvoice = entryProperties.find(
        (entry) =>
          entry.predicate.value == sharedInvoicePredicate.value
      ).object.value;

      entry.created = entryProperties.find(
        (entry) => entry.predicate.value == createdPredicate.value
      ).object.value;
    return entry;
  }

  createAccountabilityTable() {
    const uuid = uuidv4();
    this.accountabilityTableSubject = new rdflib.NamedNode(
      `${accountabilityTableBaseUri}/${uuid}`
    );
    const triples = [
      {
        subject: this.accountabilityTableSubject,
        predicate: RDF('type'),
        object: AccountabilityTableType,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: this.accountabilityTableSubject,
        predicate: MU('uuid'),
        object: uuid,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: this.storeOptions.sourceNode,
        predicate: accountabilityTablePredicate,
        object: this.accountabilityTableSubject,
        graph: this.storeOptions.sourceGraph,
      },
    ];
    this.storeOptions.store.addAll(triples);
  }

  createApplicationFormEntry() {
    const uuid = uuidv4();
    const accountabilityEntrySubject = new rdflib.NamedNode(
      `${accountabilityEntryBaseUri}/${uuid}`
    );
    const triples = [
      {
        subject: accountabilityEntrySubject,
        predicate: RDF('type'),
        object: ApplicationFormEntryType,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: accountabilityEntrySubject,
        predicate: MU('uuid'),
        object: uuid,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: this.accountabilityTableSubject,
        predicate: accountabilityEntryPredicate,
        object: accountabilityEntrySubject,
        graph: this.storeOptions.sourceGraph,
      },
    ];
    this.storeOptions.store.addAll(triples);
    return accountabilityEntrySubject;
  }

  removeAccountabilityTable() {
    const accountabilityTableTriples = this.storeOptions.store.match(
      this.accountabilityTableSubject,
      undefined,
      undefined,
      this.storeOptions.sourceGraph
    );
    const triples = [
      ...accountabilityTableTriples,
      {
        subject: this.storeOptions.sourceNode,
        predicate: accountabilityTablePredicate,
        object: this.accountabilityTableSubject,
        graph: this.storeOptions.sourceGraph,
      },
    ];
    this.storeOptions.store.removeStatements(triples);
  }

  removeEntryTriples(entry) {
    inputFieldNames.forEach((key) => {
      const propertiesTriples = [
        {
          subject: entry.accountabilityEntrySubject,
          predicate: entry[key].predicate,
          object: entry[key].oldValue,
          graph: this.storeOptions.sourceGraph,
        },
      ];
      this.storeOptions.store.removeStatements(propertiesTriples);
    });

    const entryTriples = [
      {
        subject: this.accountabilityTableSubject,
        predicate: accountabilityEntryPredicate,
        object: entry.accountabilityEntrySubject,
        graph: this.storeOptions.sourceGraph,
      },
    ];
    this.storeOptions.store.removeStatements(entryTriples);
  }

  @action
  updateFieldValueTriple(entry, field) {
    const fieldValueTriples = this.storeOptions.store.match(
      entry.accountabilityEntrySubject,
      entry[field].predicate,
      undefined,
      this.storeOptions.sourceGraph
    );
    const triples = [...fieldValueTriples];
    this.storeOptions.store.removeStatements(triples);

    if (entry[field].value.toString().length > 0) {
      this.storeOptions.store.addAll([
        {
          subject: entry.accountabilityEntrySubject,
          predicate: entry[field].predicate,
          object: entry[field].value,
          graph: this.storeOptions.sourceGraph,
        },
      ]);
    }
  }

  @action
  addEntry() {
    if (!this.hasAccountabilityTable) this.createAccountabilityTable();

    const accountabilityEntrySubject = this.createApplicationFormEntry();
    const newEntry = new ApplicationFormEntry({
      accountabilityEntrySubject,
      address: '',
      bedroomCount: 0,
      sharedInvoice: 0,
      created: new Date().toISOString(),
    });

    this.entries.pushObject(newEntry);
    super.updateValidations(); // Updates validation of the table
  }

  @action
  validate() {
    this.hasBeenFocused = true; // Allows errors to be shown in canShowErrors()
    super.updateValidations(); // Updates validation of the table
  }

  @action
  updateAddressBusValue(entry, value) {
    entry.address.errors = [];
    entry.addressBus.value = value;
    this.updateFieldValueTriple(entry, 'addressBus');


    this.hasBeenFocused = true; // Allows errors to be shown in canShowErrors()
    super.updateValidations(); // Updates validation of the table
  }

  @action
  updateSharedInvoiceValue(entry) {
    entry.sharedInvoice.errors = [];
    const parsedValue = parseInt(entry.sharedInvoice.value);
    entry.sharedInvoice.value = !isNaN(parsedValue)
      ? parsedValue
      : entry.sharedInvoice.value;
    this.updateFieldValueTriple(entry, 'sharedInvoice');

    this.hasBeenFocused = true; // Allows errors to be shown in canShowErrors()
    super.updateValidations(); // Updates validation of the table
  }

  @action
  removeEntry(entry) {
    if (this.accountabilityTableSubject) {
      this.removeEntryTriples(entry);

      if (!this.hasEntries) this.removeAccountabilityTable();
    }
    this.entries.removeObject(entry);

    this.hasBeenFocused = true; // Allows errors to be shown in canShowErrors()
    super.updateValidations(); // Updates validation of the table
  }

  isEmpty(value) {
    return value.toString().length == 0;
  }

  isPositiveInteger(value) {
    return value === parseInt(value) && value >= 0;
  }
}
