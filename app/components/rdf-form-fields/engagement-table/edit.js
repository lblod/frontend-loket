import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { triplesForPath } from '@lblod/submission-form-helpers';
import { NamedNode } from 'rdflib';
import { v4 as uuidv4 } from 'uuid';
import { next } from '@ember/runloop';
import { MU, RDF } from 'frontend-loket/rdf/namespaces';

const engagementTableBaseUri = 'http://data.lblod.info/engagement-tables';
const engagementEntryBaseUri = 'http://data.lblod.info/engagement-entries';
const lblodSubsidieBaseUri = 'http://lblod.data.gift/vocabularies/subsidie/';
const extBaseUri = 'http://mu.semte.ch/vocabularies/ext/';

const EngagementTableType = new NamedNode(
  `${lblodSubsidieBaseUri}EngagementTable`
);
const EngagementEntryType = new NamedNode(`${extBaseUri}EngagementEntry`);
const engagementTablePredicate = new NamedNode(
  `${lblodSubsidieBaseUri}engagementTable`
);
const engagementEntryPredicate = new NamedNode(`${extBaseUri}engagementEntry`);
const existingStaffPredicate = new NamedNode(
  'http://mu.semte.ch/vocabularies/ext/existingStaff'
);
const additionalStaffPredicate = new NamedNode(
  'http://mu.semte.ch/vocabularies/ext/additionalStaff'
);
const volunteersPredicate = new NamedNode(
  'http://mu.semte.ch/vocabularies/ext/volunteers'
);

class EntryProperties {
  @tracked value;
  @tracked errors = [];

  constructor(value, predicate) {
    this.value = value;
    this.predicate = predicate;
    this.errors = [];
  }
}

class EngagementEntry {
  @tracked engagementEntrySubject;

  constructor({
    engagementEntrySubject,
    existingStaff,
    additionalStaff,
    volunteers,
  }) {
    this.engagementEntrySubject = engagementEntrySubject;
    this.existingStaff = new EntryProperties(
      existingStaff,
      existingStaffPredicate
    );
    this.additionalStaff = new EntryProperties(
      additionalStaff,
      additionalStaffPredicate
    );
    this.volunteers = new EntryProperties(volunteers, volunteersPredicate);
  }
}

export default class RdfFormFieldsEngagementTableEditComponent extends InputFieldComponent {
  @tracked engagementTableSubject = null;
  @tracked entries = [];

  constructor() {
    super(...arguments);
    this.loadProvidedValue();

    // Create table and entries in the store if not already existing
    next(this, () => {
      this.initializeTable();
    });
  }

  get hasEngagementTable() {
    if (!this.engagementTableSubject) return false;
    else
      return (
        this.storeOptions.store.match(
          this.sourceNode,
          engagementTablePredicate,
          this.engagementTableSubject,
          this.storeOptions.sourceGraph
        ).length > 0
      );
  }

  loadProvidedValue() {
    const matches = triplesForPath(this.storeOptions);
    const triples = matches.triples;

    if (triples.length) {
      this.engagementTableSubject = triples[0].object; // assuming only one per form

      const entriesMatches = triplesForPath({
        store: this.storeOptions.store,
        path: engagementEntryPredicate,
        formGraph: this.storeOptions.formGraph,
        sourceNode: this.engagementTableSubject,
        sourceGraph: this.storeOptions.sourceGraph,
      });
      const entriesTriples = entriesMatches.triples;

      if (entriesTriples.length > 0) {
        for (let entry of entriesTriples) {
          const entryProperties = this.storeOptions.store.match(
            entry.object,
            undefined,
            undefined,
            this.storeOptions.sourceGraph
          );

          const parsedEntry = this.parseEntryProperties(entryProperties);

          this.entries.pushObject(
            new EngagementEntry({
              engagementEntrySubject: entry.object,
              existingStaff: parsedEntry.existingStaff,
              additionalStaff: parsedEntry.additionalStaff,
              volunteers: parsedEntry.volunteers,
            })
          );
        }
      }
    }
  }

  /**
   * Parse entry properties from triples to a simple object with the triple values
   */
  parseEntryProperties(entryProperties) {
    let entry = {};
    if (
      entryProperties.find(
        (entry) => entry.predicate.value == existingStaffPredicate.value
      )
    )
      entry.existingStaff = entryProperties.find(
        (entry) => entry.predicate.value == existingStaffPredicate.value
      ).object.value;
    if (
      entryProperties.find(
        (entry) => entry.predicate.value == additionalStaffPredicate.value
      )
    )
      entry.additionalStaff = entryProperties.find(
        (entry) => entry.predicate.value == additionalStaffPredicate.value
      ).object.value;
    if (
      entryProperties.find(
        (entry) => entry.predicate.value == volunteersPredicate.value
      )
    )
      entry.volunteers = entryProperties.find(
        (entry) => entry.predicate.value == volunteersPredicate.value
      ).object.value;
    return entry;
  }

  initializeTable() {
    if (!this.hasEngagementTable) {
      this.createEngagementTable();
      this.entries = this.createEntries();
      super.updateValidations(); // Updates validation of the table
    }
  }

  createEngagementTable() {
    const uuid = uuidv4();
    this.engagementTableSubject = new NamedNode(
      `${engagementTableBaseUri}/${uuid}`
    );
    const triples = [
      {
        subject: this.engagementTableSubject,
        predicate: RDF('type'),
        object: EngagementTableType,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: this.engagementTableSubject,
        predicate: MU('uuid'),
        object: uuid,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: this.storeOptions.sourceNode,
        predicate: engagementTablePredicate,
        object: this.engagementTableSubject,
        graph: this.storeOptions.sourceGraph,
      },
    ];
    this.storeOptions.store.addAll(triples);
  }

  createEntries() {
    let entries = [];
    const engagementEntrySubject = this.createEngagementEntry();

    const newEntry = new EngagementEntry({
      engagementEntrySubject: engagementEntrySubject,
      existingStaff: 0,
      additionalStaff: 0,
      volunteers: 0,
    });
    entries.pushObject(newEntry);

    this.initializeEntriesFields(entries);
    return entries;
  }

  createEngagementEntry() {
    let triples = [];

    const uuid = uuidv4();
    const engagementEntrySubject = new NamedNode(
      `${engagementEntryBaseUri}/${uuid}`
    );

    triples.push(
      {
        subject: engagementEntrySubject,
        predicate: RDF('type'),
        object: EngagementEntryType,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: engagementEntrySubject,
        predicate: MU('uuid'),
        object: uuid,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: this.engagementTableSubject,
        predicate: engagementEntryPredicate,
        object: engagementEntrySubject,
        graph: this.storeOptions.sourceGraph,
      }
    );

    this.storeOptions.store.addAll(triples);
    return engagementEntrySubject;
  }

  updateFieldValueTriple(entry, field) {
    const fieldValueTriples = this.storeOptions.store.match(
      entry.engagementEntrySubject,
      entry[field].predicate,
      undefined,
      this.storeOptions.sourceGraph
    );
    const triples = [...fieldValueTriples];
    this.storeOptions.store.removeStatements(triples);

    if (entry[field].value.toString().length > 0) {
      this.storeOptions.store.addAll([
        {
          subject: entry.engagementEntrySubject,
          predicate: entry[field].predicate,
          object: entry[field].value,
          graph: this.storeOptions.sourceGraph,
        },
      ]);
    }
  }

  @action
  updateExistingStaffValue(entry, event) {
    if (event) {
      entry.existingStaff.value = event.target.value;
    }

    entry.existingStaff.errors = [];
    const parsedValue = Number(entry.existingStaff.value);
    entry.existingStaff.value = !isNaN(parsedValue)
      ? parsedValue
      : entry.existingStaff.value;
    this.updateFieldValueTriple(entry, 'existingStaff');

    if (this.isEmpty(entry.existingStaff.value)) {
      entry.existingStaff.errors.pushObject({
        message: 'Bestaand personeelskader is verplicht.',
      });
    } else if (!this.isPositiveNumber(entry.existingStaff.value)) {
      entry.existingStaff.errors.pushObject({
        message: 'Bestaand personeelskader is niet een positief nummer.',
      });
    }
    this.hasBeenFocused = true; // Allows errors to be shown in canShowErrors()
    super.updateValidations(); // Updates validation of the table
  }

  @action
  updateAdditionalStaffValue(entry, event) {
    if (event) {
      entry.additionalStaff.value = event.target.value;
    }

    entry.additionalStaff.errors = [];
    const parsedValue = Number(entry.additionalStaff.value);
    entry.additionalStaff.value = !isNaN(parsedValue)
      ? parsedValue
      : entry.additionalStaff.value;
    this.updateFieldValueTriple(entry, 'additionalStaff');

    if (this.isEmpty(entry.additionalStaff.value)) {
      entry.additionalStaff.errors.pushObject({
        message: 'Extra aangetrokken betaald personeel is verplicht.',
      });
    } else if (!this.isPositiveNumber(entry.additionalStaff.value)) {
      entry.additionalStaff.errors.pushObject({
        message:
          'Extra aangetrokken betaald personeel is niet een positief nummer.',
      });
    }
    this.hasBeenFocused = true; // Allows errors to be shown in canShowErrors()
    super.updateValidations(); // Updates validation of the table
  }

  @action
  updateVolunteersValue(entry, event) {
    if (event) {
      entry.volunteers.value = event.target.value;
    }

    entry.volunteers.errors = [];
    const parsedValue = Number(entry.volunteers.value);
    entry.volunteers.value = !isNaN(parsedValue)
      ? parsedValue
      : entry.volunteers.value;
    this.updateFieldValueTriple(entry, 'volunteers');

    if (this.isEmpty(entry.volunteers.value)) {
      entry.volunteers.errors.pushObject({
        message: 'Ingezette vrijwilligers is verplicht.',
      });
    } else if (!this.isPositiveNumber(entry.volunteers.value)) {
      entry.volunteers.errors.pushObject({
        message: 'Ingezette vrijwilligers is niet een positief nummer.',
      });
    }
    this.hasBeenFocused = true; // Allows errors to be shown in canShowErrors()
    super.updateValidations(); // Updates validation of the table
  }

  initializeEntriesFields(entries) {
    let triples = [];
    entries.forEach((entry) => {
      triples.push(
        {
          subject: entry.engagementEntrySubject,
          predicate: entry['existingStaff'].predicate,
          object: entry['existingStaff'].value,
          graph: this.storeOptions.sourceGraph,
        },
        {
          subject: entry.engagementEntrySubject,
          predicate: entry['additionalStaff'].predicate,
          object: entry['additionalStaff'].value,
          graph: this.storeOptions.sourceGraph,
        },
        {
          subject: entry.engagementEntrySubject,
          predicate: entry['volunteers'].predicate,
          object: entry['volunteers'].value,
          graph: this.storeOptions.sourceGraph,
        }
      );
    });
    this.storeOptions.store.addAll(triples);
  }

  /**
   * Update entry fields in the store.
   */
  updateEntryFields(entry) {
    this.updateExistingStaffValue(entry);
    this.updateAdditionalStaffValue(entry);
    this.updateVolunteersValue(entry);
    this.updateEstimatedCostValue(entry);
  }

  // ------------------
  // FIELDS VALIDATIONS

  isEmpty(value) {
    return value.toString().length == 0;
  }

  isPositiveNumber(value) {
    const number = Number(value);
    if (isNaN(number)) return false;
    return number >= 0;
  }
}
