import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { triplesForPath } from '@lblod/submission-form-helpers';
import { NamedNode } from 'rdflib';
import { v4 as uuidv4 } from 'uuid';
import { A } from '@ember/array';
import { MU, RDF } from 'frontend-loket/rdf/namespaces';

const subsidyBaseUri = 'http://lblod.data.gift/vocabularies/subsidie/ukraine/';

const accountabilityTableBaseUri =
  'http://data.lblod.info/accountability-tables';

const accountabilityEntryBaseUri =
  'http://data.lblod.info/accountability-entries';

const lblodSubsidieBaseUri = 'http://lblod.data.gift/vocabularies/subsidie/';

const AccountabilityTableType = new NamedNode(
  `${lblodSubsidieBaseUri}AccountabilityTable`,
);
const AccountabilityEntryType = new NamedNode(
  `${lblodSubsidieBaseUri}AccountabilityEntry`,
);
const accountabilityTablePredicate = new NamedNode(
  `${lblodSubsidieBaseUri}accountabilityTable`,
);
const accountabilityEntryPredicate = new NamedNode(
  `${lblodSubsidieBaseUri}accountabilityEntry`,
);

const createdPredicate = new NamedNode('http://purl.org/dc/terms/created');

const hasInvalidRowPredicate = new NamedNode(
  `${subsidyBaseUri}hasInvalidAccountabilityTableEntry`,
);
const validAccountabilityTable = new NamedNode(
  `${lblodSubsidieBaseUri}validAccountabilityTable`,
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

export default class RdfFormFieldsAccountabilityTableEditComponent extends InputFieldComponent {
  @service() addressregister;
  @service() store;

  @tracked accountabilityTableSubject = null;
  @tracked entries = A();
  @tracked errors = A();

  get hasAccountabilityTable() {
    if (!this.accountabilityTableSubject) return false;
    else
      return (
        this.storeOptions.store.match(
          this.sourceNode,
          accountabilityTablePredicate,
          this.accountabilityTableSubject,
          this.storeOptions.sourceGraph,
        ).length > 0
      );
  }

  get disabledCreate() {
    return this.args.show || this.entries.length >= 20;
  }

  constructor() {
    super(...arguments);
    this.loadProvidedValue();

    if (!this.hasAccountabilityTable) {
      this.createAccountabilityTable();
      this.createAccountabilityEntry();
    }
  }

  get sortedEntries() {
    return this.entries.sort((a, b) => {
      a.created.localeCompare(b.created);
    });
  }

  async loadProvidedValue() {
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
      const createdEntryProperty = this.storeOptions.store.match(
        entry.object,
        createdPredicate,
        undefined,
        this.storeOptions.sourceGraph,
      );

      this.entries.pushObject({
        entrySubject: entry.object,
        created: createdEntryProperty[0]?.object.value,
      });
    }
  }

  async parseFileProperties(fileProperties) {
    const files = [];
    for (const file of fileProperties) {
      const fileUri = file.object.value;
      const fileObject = await this.retrieveFileField(fileUri);
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
      const file = files.at(0);
      if (file) return new FileField({ record: file, errors: [] });
      else
        return new FileField({
          record: null,
          errors: ['Geen bestand gevonden'],
        });
    } catch (error) {
      console.log(
        `Failed to retrieve file with URI ${uri}: ${JSON.stringify(error)}`,
      );
      return new FileField({
        record: null,
        errors: ['Ophalen van het bestand is mislukt'],
      });
    }
  }

  createAccountabilityTable() {
    const uuid = uuidv4();
    this.accountabilityTableSubject = new NamedNode(
      `${accountabilityTableBaseUri}/${uuid}`,
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

  @action
  createAccountabilityEntry() {
    const uuid = uuidv4();
    const created = new Date().toISOString();
    const accountabilityEntrySubject = new NamedNode(
      `${accountabilityEntryBaseUri}/${uuid}`,
    );
    const triples = [
      {
        subject: accountabilityEntrySubject,
        predicate: RDF('type'),
        object: AccountabilityEntryType,
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

    triples.push({
      subject: accountabilityEntrySubject,
      predicate: createdPredicate,
      object: created,
      graph: this.storeOptions.sourceGraph,
    });

    this.entries.pushObject({
      entrySubject: accountabilityEntrySubject,
      created: created,
    });

    this.storeOptions.store.addAll(triples);
    return accountabilityEntrySubject;
  }

  @action
  removeEntry(tableEntrySubject) {
    const entryTriples = [
      {
        subject: this.accountabilityTableSubject,
        predicate: accountabilityEntryPredicate,
        object: tableEntrySubject,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: this.accountabilityTableSubject,
        predicate: hasInvalidRowPredicate,
        object: tableEntrySubject,
        graph: this.storeOptions.sourceGraph,
      },
    ];

    this.storeOptions.store.removeStatements(entryTriples);

    this.entries = this.entries.filter(
      (entry) => entry.entrySubject != tableEntrySubject,
    );
    this.validate();
  }

  updateTripleObject(subject, predicate, newObject = null) {
    const triples = this.storeOptions.store.match(
      subject,
      predicate,
      undefined,
      this.storeOptions.sourceGraph,
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
  validate() {
    this.errors = A([]);
    const invalidRow = this.storeOptions.store.any(
      this.accountabilityTableSubject,
      hasInvalidRowPredicate,
      null,
      this.storeOptions.sourceGraph,
    );

    if (invalidRow) {
      this.errors.pushObject({
        message: 'Een van de rijen is niet correct ingevuld',
      });

      this.updateTripleObject(
        this.accountabilityTableSubject,
        validAccountabilityTable,
        null,
      );
    } else {
      this.updateTripleObject(
        this.accountabilityTableSubject,
        validAccountabilityTable,
        true,
      );
    }
  }
}
