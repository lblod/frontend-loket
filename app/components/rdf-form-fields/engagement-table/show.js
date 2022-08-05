import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import { tracked } from '@glimmer/tracking';
import { triplesForPath } from '@lblod/submission-form-helpers';
import { next } from '@ember/runloop';
import { NamedNode } from 'rdflib';

const extBaseUri = 'http://mu.semte.ch/vocabularies/ext/';
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

  constructor(value, predicate) {
    this.value = value;
    this.predicate = predicate;
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

export default class RdfFormFieldsEngagementTableShowComponent extends InputFieldComponent {
  @tracked engagementTableSubject = null;
  @tracked entries = [];

  constructor() {
    super(...arguments);
    next(this, () => {
      this.loadProvidedValue();
    });
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
}
