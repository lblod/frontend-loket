import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { triplesForPath } from '@lblod/submission-form-helpers';
import { NamedNode } from 'rdflib';
import { v4 as uuidv4 } from 'uuid';
import { RDF } from '@lblod/submission-form-helpers';
import { scheduleOnce } from '@ember/runloop';
import { MU } from 'frontend-loket/rdf/namespaces';

const bicycleInfrastructureUri =
  'http://lblod.data.gift/vocabularies/subsidie/bicycle-infrastructure#';
const resourceInstanceBaseUri =
  'http://lblod.data.gift/id/subsidie/bicycle-infrastructure';
const ObjectiveTableType = new NamedNode(
  `${bicycleInfrastructureUri}ObjectiveTable`
);
const objectiveTablePredicate = new NamedNode(
  `${bicycleInfrastructureUri}objectiveTable`
);
const kilometersPredicate = new NamedNode(
  `${bicycleInfrastructureUri}kilometers`
);

const hasInvalidCellPredicate = new NamedNode(
  `${bicycleInfrastructureUri}/hasInvalidObjectiveTableEntry`
);
const validObjectiveTable = new NamedNode(
  `${bicycleInfrastructureUri}validObjectiveTable`
);

export default class RdfFormFieldsObjectiveTableEditComponent extends InputFieldComponent {
  @tracked objectiveTableSubject = null;
  @tracked errors = [];

  get hasObjectiveTable() {
    return (
      this.storeOptions.store.match(
        this.sourceNode,
        objectiveTablePredicate,
        this.objectiveTableSubject,
        this.storeOptions.sourceGraph
      ).length > 0
    );
  }

  constructor() {
    super(...arguments);
    scheduleOnce('actions', this, this.initTable);
  }

  initTable() {
    // Create table and entries in the store if not already existing
    if (this.hasObjectiveTable) {
      this.loadProvidedValue();
      this.validate();
    } else {
      this.createObjectiveTable();
    }
  }

  loadProvidedValue() {
    const matches = triplesForPath(this.storeOptions);
    const triples = matches.triples;

    if (triples.length) {
      this.objectiveTableSubject = triples[0].object; // assuming only one per form
    }
  }

  createObjectiveTable() {
    const uuid = uuidv4();
    this.objectiveTableSubject = new NamedNode(
      `${resourceInstanceBaseUri}/${uuid}`
    );
    const triples = [
      {
        subject: this.objectiveTableSubject,
        predicate: RDF('type'),
        object: ObjectiveTableType,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: this.objectiveTableSubject,
        predicate: MU('uuid'),
        object: uuid,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: this.storeOptions.sourceNode,
        predicate: objectiveTablePredicate,
        object: this.objectiveTableSubject,
        graph: this.storeOptions.sourceGraph,
      },
    ];
    this.storeOptions.store.addAll(triples);
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

  cellHasValue() {
    const cells = this.storeOptions.store.match(
      null,
      kilometersPredicate,
      null,
      this.storeOptions.sourceGraph
    );
    const cellsWithValue = cells.filter((item) => item.object.value > 0);
    return cellsWithValue.length > 0;
  }

  @action
  validate() {
    this.errors = [];

    const invalidRow = this.storeOptions.store.any(
      this.objectiveTableSubject,
      hasInvalidCellPredicate,
      null,
      this.storeOptions.sourceGraph
    );

    if (!this.cellHasValue()) {
      this.errors.pushObject({
        message: 'Minstens één veld moet een waarde groter dan 0 bevatten.',
      });
      this.updateTripleObject(
        this.objectiveTableSubject,
        validObjectiveTable,
        null
      );
    } else if (invalidRow) {
      this.errors.pushObject({
        message: 'Een van de rijen is niet correct ingevuld',
      });
      this.updateTripleObject(
        this.objectiveTableSubject,
        validObjectiveTable,
        null
      );
    } else {
      this.updateTripleObject(
        this.objectiveTableSubject,
        validObjectiveTable,
        true
      );
    }
  }
}
