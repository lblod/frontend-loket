import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { triplesForPath } from '@lblod/submission-form-helpers';
import { literal, NamedNode } from 'rdflib';
import { v4 as uuidv4 } from 'uuid';
import { next } from '@ember/runloop';
import { guidFor } from '@ember/object/internals';
import { LBLOD_SUBSIDIE, MU, RDF, XSD } from 'frontend-loket/rdf/namespaces';

const applicationFormTableBaseUri =
  'http://data.lblod.info/application-form-tables';
const applicationFormEntryBaseUri =
  'http://data.lblod.info/application-form-entries';
const lblodSubsidieBaseUri = 'http://lblod.data.gift/vocabularies/subsidie/';
const extBaseUri = 'http://mu.semte.ch/vocabularies/ext/';

const ApplicationFormTableType = new NamedNode(
  `${lblodSubsidieBaseUri}ApplicationFormTable`
);
const ApplicationFormEntryType = new NamedNode(
  `${extBaseUri}ApplicationFormEntry`
);
const applicationFormTablePredicate = new NamedNode(
  `${lblodSubsidieBaseUri}applicationFormTable`
);
const applicationFormEntryPredicate = new NamedNode(
  `${extBaseUri}applicationFormEntry`
);
const actorNamePredicate = new NamedNode(
  'http://mu.semte.ch/vocabularies/ext/actorName'
);
const numberChildrenForFullDayPredicate = new NamedNode(
  'http://mu.semte.ch/vocabularies/ext/numberChildrenForFullDay'
);
const numberChildrenForHalfDayPredicate = new NamedNode(
  'http://mu.semte.ch/vocabularies/ext/numberChildrenForHalfDay'
);
const numberChildrenPerInfrastructurePredicate = new NamedNode(
  'http://mu.semte.ch/vocabularies/ext/numberChildrenPerInfrastructure'
);
const totalAmountPredicate = new NamedNode(
  'http://lblod.data.gift/vocabularies/subsidie/totalAmount'
);
const createdPredicate = new NamedNode('http://purl.org/dc/terms/created');

const inputFieldNames = [
  'actorName',
  'numberChildrenForFullDay',
  'numberChildrenForHalfDay',
  'numberChildrenPerInfrastructure',
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
  @tracked applicationFormEntrySubject;
  @tracked totalAmount = 0;

  calculateEntryTotal() {
    this.totalAmount =
      this.numberChildrenForFullDay.value * 20 +
      this.numberChildrenForHalfDay.value * 10 +
      this.numberChildrenPerInfrastructure.value * 10;
  }

  constructor({
    applicationFormEntrySubject,
    actorName,
    numberChildrenForFullDay,
    numberChildrenForHalfDay,
    numberChildrenPerInfrastructure,
    created,
  }) {
    this.applicationFormEntrySubject = applicationFormEntrySubject;

    this.actorName = new EntryProperties(actorName, actorNamePredicate);
    this.numberChildrenForFullDay = new EntryProperties(
      numberChildrenForFullDay,
      numberChildrenForFullDayPredicate
    );
    this.numberChildrenForHalfDay = new EntryProperties(
      numberChildrenForHalfDay,
      numberChildrenForHalfDayPredicate
    );
    this.numberChildrenPerInfrastructure = new EntryProperties(
      numberChildrenPerInfrastructure,
      numberChildrenPerInfrastructurePredicate
    );
    this.created = new EntryProperties(created, createdPredicate);
    this.calculateEntryTotal();
  }
}

export default class RdfFormFieldsApplicationFormTableEditComponent extends InputFieldComponent {
  id = `application-form-table-${guidFor(this)}`;

  @tracked usedParentalContribution;
  @tracked applicationFormTableSubject = null;
  @tracked entries = [];
  @tracked totalAmount = 0;

  constructor() {
    super(...arguments);
    this.loadProvidedValue();

    this.calculateTotal(this.entries);

    // Add an entry by default as an example
    next(this, () => {
      if (this.entries.length == 0) {
        this.addEntry();
        this.hasBeenFocused = false;
      }
    });

    /**
     * NOTE: registering hook to keep parent contribution in sync.
     */
    const observe = ({ inserts = [], deletes = [] } = {}) => {
      const predicate = LBLOD_SUBSIDIE('usedParentalContribution');
      const changes = [...inserts, ...deletes];
      /**
       * NOTE: we only want to trigger the observer when changes happened
       *       to the predicate lblodSubsidie:usedParentalContribution
       */
      if (changes.map((t) => t.predicate).find((p) => p.equals(predicate))) {
        const { store, sourceNode, sourceGraph } = this.storeOptions;
        this.usedParentalContribution = !!store.any(
          sourceNode,
          predicate,
          undefined,
          sourceGraph
        );
        this.updateAangevraagdBedrag();
      }
    };
    this.args.formStore.registerObserver((delta) => {
      observe(delta);
    }, this.id);
  }

  get hasApplicationFormTable() {
    if (!this.applicationFormTableSubject) return false;
    else
      return (
        this.storeOptions.store.match(
          this.sourceNode,
          applicationFormTablePredicate,
          this.applicationFormTableSubject,
          this.storeOptions.sourceGraph
        ).length > 0
      );
  }

  get hasEntries() {
    return (
      this.storeOptions.store.match(
        this.applicationFormTableSubject,
        applicationFormEntryPredicate,
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

    if (triples.length) {
      this.usedParentalContribution = !!this.storeOptions.store.any(
        this.storeOptions.sourceNode,
        LBLOD_SUBSIDIE('usedParentalContribution'),
        undefined,
        this.storeOptions.sourceGraph
      );
      this.applicationFormTableSubject = triples[0].object; // assuming only one per form

      const entriesMatches = triplesForPath({
        store: this.storeOptions.store,
        path: applicationFormEntryPredicate,
        formGraph: this.storeOptions.formGraph,
        sourceNode: this.applicationFormTableSubject,
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
            new ApplicationFormEntry({
              applicationFormEntrySubject: entry.object,
              actorName: parsedEntry.actorName ? parsedEntry.actorName : '',
              numberChildrenForFullDay: parsedEntry.numberChildrenForFullDay
                ? parsedEntry.numberChildrenForFullDay
                : 0,
              numberChildrenForHalfDay: parsedEntry.numberChildrenForHalfDay
                ? parsedEntry.numberChildrenForHalfDay
                : 0,
              numberChildrenPerInfrastructure:
                parsedEntry.numberChildrenPerInfrastructure
                  ? parsedEntry.numberChildrenPerInfrastructure
                  : 0,
              created: parsedEntry.created,
            })
          );
        }
      }
    }
  }

  willDestroy() {
    this.args.formStore.deregisterObserver(this.id);
  }

  /**
   * Parse entry properties from triples to a simple object with the triple values
   */
  parseEntryProperties(entryProperties) {
    let entry = {};
    if (
      entryProperties.find(
        (entry) => entry.predicate.value == actorNamePredicate.value
      )
    )
      entry.actorName = entryProperties.find(
        (entry) => entry.predicate.value == actorNamePredicate.value
      ).object.value;
    if (
      entryProperties.find(
        (entry) =>
          entry.predicate.value == numberChildrenForFullDayPredicate.value
      )
    )
      entry.numberChildrenForFullDay = entryProperties.find(
        (entry) =>
          entry.predicate.value == numberChildrenForFullDayPredicate.value
      ).object.value;
    if (
      entryProperties.find(
        (entry) =>
          entry.predicate.value == numberChildrenForHalfDayPredicate.value
      )
    )
      entry.numberChildrenForHalfDay = entryProperties.find(
        (entry) =>
          entry.predicate.value == numberChildrenForHalfDayPredicate.value
      ).object.value;
    if (
      entryProperties.find(
        (entry) =>
          entry.predicate.value ==
          numberChildrenPerInfrastructurePredicate.value
      )
    )
      entry.numberChildrenPerInfrastructure = entryProperties.find(
        (entry) =>
          entry.predicate.value ==
          numberChildrenPerInfrastructurePredicate.value
      ).object.value;
    if (
      entryProperties.find(
        (entry) => entry.predicate.value == createdPredicate.value
      )
    )
      entry.created = entryProperties.find(
        (entry) => entry.predicate.value == createdPredicate.value
      ).object.value;
    return entry;
  }

  createApplicationFormTable() {
    const uuid = uuidv4();
    this.applicationFormTableSubject = new NamedNode(
      `${applicationFormTableBaseUri}/${uuid}`
    );
    const triples = [
      {
        subject: this.applicationFormTableSubject,
        predicate: RDF('type'),
        object: ApplicationFormTableType,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: this.applicationFormTableSubject,
        predicate: MU('uuid'),
        object: uuid,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: this.storeOptions.sourceNode,
        predicate: applicationFormTablePredicate,
        object: this.applicationFormTableSubject,
        graph: this.storeOptions.sourceGraph,
      },
    ];
    this.storeOptions.store.addAll(triples);
  }

  createApplicationFormEntry() {
    const uuid = uuidv4();
    const applicationFormEntrySubject = new NamedNode(
      `${applicationFormEntryBaseUri}/${uuid}`
    );
    const triples = [
      {
        subject: applicationFormEntrySubject,
        predicate: RDF('type'),
        object: ApplicationFormEntryType,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: applicationFormEntrySubject,
        predicate: MU('uuid'),
        object: uuid,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: this.applicationFormTableSubject,
        predicate: applicationFormEntryPredicate,
        object: applicationFormEntrySubject,
        graph: this.storeOptions.sourceGraph,
      },
    ];
    this.storeOptions.store.addAll(triples);
    return applicationFormEntrySubject;
  }

  removeApplicationFormTable() {
    const applicationFormTableTriples = this.storeOptions.store.match(
      this.applicationFormTableSubject,
      undefined,
      undefined,
      this.storeOptions.sourceGraph
    );
    const triples = [
      ...applicationFormTableTriples,
      {
        subject: this.storeOptions.sourceNode,
        predicate: applicationFormTablePredicate,
        object: this.applicationFormTableSubject,
        graph: this.storeOptions.sourceGraph,
      },
    ];
    this.storeOptions.store.removeStatements(triples);
  }

  removeEntryTriples(entry) {
    inputFieldNames.forEach((key) => {
      const propertiesTriples = [
        {
          subject: entry.applicationFormEntrySubject,
          predicate: entry[key].predicate,
          object: entry[key].oldValue,
          graph: this.storeOptions.sourceGraph,
        },
      ];
      this.storeOptions.store.removeStatements(propertiesTriples);
    });

    const entryTriples = [
      {
        subject: this.applicationFormTableSubject,
        predicate: applicationFormEntryPredicate,
        object: entry.applicationFormEntrySubject,
        graph: this.storeOptions.sourceGraph,
      },
    ];
    this.storeOptions.store.removeStatements(entryTriples);
  }

  updateFieldValueTriple(entry, field) {
    const fieldValueTriples = this.storeOptions.store.match(
      entry.applicationFormEntrySubject,
      entry[field].predicate,
      undefined,
      this.storeOptions.sourceGraph
    );
    const triples = [...fieldValueTriples];
    this.storeOptions.store.removeStatements(triples);

    if (entry[field].value.toString().length > 0) {
      this.storeOptions.store.addAll([
        {
          subject: entry.applicationFormEntrySubject,
          predicate: entry[field].predicate,
          object: entry[field].value,
          graph: this.storeOptions.sourceGraph,
        },
      ]);
    }
  }

  updateAangevraagdBedrag() {
    this.totalAmount = this.calculateTotal(this.entries);
    const aangevraagdBedragTriples = this.storeOptions.store.match(
      this.storeOptions.sourceNode,
      totalAmountPredicate,
      undefined,
      this.storeOptions.sourceGraph
    );
    const triples = [...aangevraagdBedragTriples];
    this.storeOptions.store.removeStatements(triples);

    this.storeOptions.store.addAll([
      {
        subject: this.storeOptions.sourceNode,
        predicate: totalAmountPredicate,
        object: literal(
          Number.parseFloat(this.totalAmount).toFixed(2),
          XSD('float')
        ),
        graph: this.storeOptions.sourceGraph,
      },
    ]);
  }

  calculateTotal(entries) {
    let total = 0;
    entries.forEach((entry) => {
      total += entry.totalAmount;
    });
    if (this.usedParentalContribution) {
      total = total / 2;
    }
    if (total !== this.totalAmount) this.totalAmount = total;
    return total;
  }

  @action
  addEntry() {
    if (!this.hasApplicationFormTable) this.createApplicationFormTable();

    const applicationFormEntrySubject = this.createApplicationFormEntry();
    const newEntry = new ApplicationFormEntry({
      applicationFormEntrySubject,
      actorName: '',
      numberChildrenForFullDay: 0,
      numberChildrenForHalfDay: 0,
      numberChildrenPerInfrastructure: 0,
      created: new Date().toISOString(),
    });

    this.entries.pushObject(newEntry);

    this.updateDefaultEntryFields(newEntry);
    super.updateValidations(); // Updates validation of the table
  }

  @action
  updateActorNameValue(entry, event) {
    if (event) {
      entry.actorName.value = event.target.value;
    }

    entry.actorName.errors = [];
    this.updateFieldValueTriple(entry, 'actorName');
    if (this.isEmpty(entry.actorName.value)) {
      entry.actorName.errors.pushObject({
        message: 'Naam actor is verplicht.',
      });
    }
    this.hasBeenFocused = true; // Allows errors to be shown in canShowErrors()
    super.updateValidations(); // Updates validation of the table
  }

  @action
  updateNumberChildrenForFullDayValue(entry, event) {
    if (event) {
      entry.numberChildrenForFullDay.value = event.target.value;
    }

    entry.numberChildrenForFullDay.errors = [];
    const parsedValue = parseInt(entry.numberChildrenForFullDay.value);
    entry.numberChildrenForFullDay.value = !isNaN(parsedValue)
      ? parsedValue
      : entry.numberChildrenForFullDay.value;
    entry.calculateEntryTotal();
    this.updateFieldValueTriple(entry, 'numberChildrenForFullDay');
    this.updateAangevraagdBedrag();

    if (this.isEmpty(entry.numberChildrenForFullDay.value)) {
      entry.numberChildrenForFullDay.errors.pushObject({
        message: 'Aantal kinderen voor alle volle dagen is verplicht.',
      });
    } else if (!this.isPositiveInteger(entry.numberChildrenForFullDay.value)) {
      entry.numberChildrenForFullDay.errors.pushObject({
        message:
          'Aantal kinderen voor alle volle dagen is niet een positief nummer.',
      });
    }
    this.hasBeenFocused = true; // Allows errors to be shown in canShowErrors()
    super.updateValidations(); // Updates validation of the table
  }

  @action
  updateNumberChildrenForHalfDayValue(entry, event) {
    if (event) {
      entry.numberChildrenForHalfDay.value = event.target.value;
    }

    entry.numberChildrenForHalfDay.errors = [];
    const parsedValue = parseInt(entry.numberChildrenForHalfDay.value);
    entry.numberChildrenForHalfDay.value = !isNaN(parsedValue)
      ? parsedValue
      : entry.numberChildrenForHalfDay.value;
    entry.calculateEntryTotal();
    this.updateFieldValueTriple(entry, 'numberChildrenForHalfDay');
    this.updateAangevraagdBedrag();

    if (this.isEmpty(entry.numberChildrenForHalfDay.value)) {
      entry.numberChildrenForHalfDay.errors.pushObject({
        message: 'Aantal kinderen voor alle halve dagen is verplicht.',
      });
    } else if (!this.isPositiveInteger(entry.numberChildrenForHalfDay.value)) {
      entry.numberChildrenForHalfDay.errors.pushObject({
        message:
          'Aantal kinderen voor alle halve dagen is niet een positief nummer.',
      });
    }
    this.hasBeenFocused = true; // Allows errors to be shown in canShowErrors()
    super.updateValidations(); // Updates validation of the table
  }

  @action
  updateNumberChildrenPerInfrastructureValue(entry, event) {
    if (event) {
      entry.numberChildrenPerInfrastructure.value = event.target.value;
    }

    entry.numberChildrenPerInfrastructure.errors = [];
    const parsedValue = parseInt(entry.numberChildrenPerInfrastructure.value);
    entry.numberChildrenPerInfrastructure.value = !isNaN(parsedValue)
      ? parsedValue
      : entry.numberChildrenPerInfrastructure.value;
    entry.calculateEntryTotal();
    this.updateFieldValueTriple(entry, 'numberChildrenPerInfrastructure');
    this.updateAangevraagdBedrag();

    if (this.isEmpty(entry.numberChildrenPerInfrastructure.value)) {
      entry.numberChildrenPerInfrastructure.errors.pushObject({
        message: 'Aantal kinderen per infrastructuur per dag is verplicht.',
      });
    } else if (
      !this.isPositiveInteger(entry.numberChildrenPerInfrastructure.value)
    ) {
      entry.numberChildrenPerInfrastructure.errors.pushObject({
        message:
          'Aantal kinderen per infrastructuur per dag is niet een positief nummer.',
      });
    }
    this.hasBeenFocused = true; // Allows errors to be shown in canShowErrors()
    super.updateValidations(); // Updates validation of the table
  }

  @action
  updateCreatedValue(entry) {
    this.updateFieldValueTriple(entry, 'created');
  }

  @action
  removeEntry(entry) {
    if (this.applicationFormTableSubject) {
      this.removeEntryTriples(entry);

      if (!this.hasEntries) this.removeApplicationFormTable();
    }
    this.entries.removeObject(entry);
    this.updateAangevraagdBedrag();

    this.hasBeenFocused = true; // Allows errors to be shown in canShowErrors()
    super.updateValidations(); // Updates validation of the table
  }

  isEmpty(value) {
    return value.toString().length == 0;
  }

  isPositiveInteger(value) {
    return value === parseInt(value) && value >= 0;
  }

  /**
   * Update entry default fields.
   * We update numbers to default them to 0 as well as the creation time of the entry.
   * The actor name doesn't have a default value, it'll be entered by the user.
   */
  updateDefaultEntryFields(entry) {
    this.updateNumberChildrenForFullDayValue(entry);
    this.updateNumberChildrenForHalfDayValue(entry);
    this.updateNumberChildrenPerInfrastructureValue(entry);
    this.updateCreatedValue(entry);
  }
}
