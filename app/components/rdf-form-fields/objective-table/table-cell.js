import Component from '@glimmer/component';
import { schedule } from '@ember/runloop';
import rdflib from 'browser-rdflib';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { v4 as uuidv4 } from 'uuid';
import { RDF } from '@lblod/submission-form-helpers';

const MU = new rdflib.Namespace('http://mu.semte.ch/vocabularies/core/');

const bicycleInfrastructureUri =
  'http://lblod.data.gift/vocabularies/subsidie/bicycle-infrastructure#';
const resourceInstanceBaseUri =
  'http://lblod.data.gift/id/subsidie/bicycle-infrastructure';
const objectiveEntryPredicate = new rdflib.NamedNode(
  `${bicycleInfrastructureUri}objectiveEntry`
);
const ObjectiveEntryType = new rdflib.NamedNode(
  `${bicycleInfrastructureUri}ObjectiveEntry`
);

const objectiveTablePredicate = new rdflib.NamedNode(
  `${bicycleInfrastructureUri}objectiveTable`
);
const approachTypePredicate = new rdflib.NamedNode(
  `${bicycleInfrastructureUri}approachType`
);
const directionTypePredicate = new rdflib.NamedNode(
  `${bicycleInfrastructureUri}directionType`
);
const bikeLaneTypePredicate = new rdflib.NamedNode(
  `${bicycleInfrastructureUri}bikeLaneType`
);
const kilometersPredicate = new rdflib.NamedNode(
  `${bicycleInfrastructureUri}kilometers`
);

const hasInvalidCellPredicate = new rdflib.NamedNode(
  `${bicycleInfrastructureUri}/hasInvalidObjectiveTableEntry`
);

export default class RdfFormFieldsObjectiveTableTableCellComponent extends Component {
  @tracked tableEntryUri = null;
  @tracked errors = [];
  @tracked kilometers = null;

  get storeOptions() {
    return this.args.storeOptions;
  }

  get objectiveTableSubject() {
    const triple = this.storeOptions.store.match(
      this.storeOptions.sourceNode,
      objectiveTablePredicate,
      null,
      this.storeOptions.sourceGraph
    );
    return new rdflib.NamedNode(triple[0].object.value);
  }

  get bikeLaneType() {
    return `${bicycleInfrastructureUri}${this.args.bikeLaneType}`;
  }

  get approachType() {
    return `${bicycleInfrastructureUri}${this.args.approachType}`;
  }

  get directionType() {
    return `${bicycleInfrastructureUri}${this.args.directionType}`;
  }

  //...
  get onUpdateCell() {
    return this.args.onUpdateCell;
  }

  constructor() {
    super(...arguments);
    schedule('actions', this, this.initTableCell);
  }

  initTableCell() {
    if (this.hasValues()) {
      this.loadProvidedValue();
    } else {
      this.initializeDefault();
    }

    if (!this.args.disabled) {
      this.onUpdateCell();
    }
  }

  hasValues() {
    const entries = this.storeOptions.store.match(
      this.objectiveTableSubject,
      objectiveEntryPredicate,
      undefined,
      this.storeOptions.sourceGraph
    );
    const entriesWithDetails = [];

    // Get all properties for each entry
    entries.forEach((element) => {
      const result = this.storeOptions.store.match(
        element.object,
        undefined,
        undefined,
        this.storeOptions.sourceGraph
      );
      if (result.length > 0) {
        entriesWithDetails.push(result);
      }
    });

    // See if one of the entries matches requirements of this table cell
    const results = entriesWithDetails.filter((item) => {
      let hasBikeLaneType = false;
      let hasApproachType = false;
      let hasDirectionType = false;

      item.forEach((triple) => {
        if (triple.object.value == this.bikeLaneType) {
          hasBikeLaneType = true;
        }
        if (triple.object.value == this.approachType) {
          hasApproachType = true;
        }
        if (triple.object.value == this.directionType) {
          hasDirectionType = true;
        }
      });

      return hasBikeLaneType && hasApproachType && hasDirectionType;
    });

    // There is a possibility this can happen in the future so early warning sign for that
    if (results.length > 1) {
      throw 'A table-cell should only have one matching triple';
    }

    //TODO: refactor later -> but in general we don't exepect side effects in checking functions
    if (results.length == 1) {
      this.tableEntryUri = results[0][0].subject;
    }

    return results.length;
  }

  loadProvidedValue() {
    const kilometersTriple = this.storeOptions.store.match(
      this.tableEntryUri,
      kilometersPredicate,
      null,
      this.storeOptions.sourceGraph
    );
    this.kilometers = kilometersTriple[0].object.value;
  }

  initializeDefault() {
    const uuid = uuidv4();
    const tableEntryUri = new rdflib.NamedNode(
      `${resourceInstanceBaseUri}/${uuid}`
    );

    let triples = [
      {
        subject: tableEntryUri,
        predicate: RDF('type'),
        object: ObjectiveEntryType,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: tableEntryUri,
        predicate: MU('uuid'),
        object: uuid,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: this.objectiveTableSubject,
        predicate: objectiveEntryPredicate,
        object: tableEntryUri,
        graph: this.storeOptions.sourceGraph,
      },
    ];

    triples.push({
      subject: tableEntryUri,
      predicate: bikeLaneTypePredicate,
      object: this.bikeLaneType,
      graph: this.storeOptions.sourceGraph,
    });

    triples.push({
      subject: tableEntryUri,
      predicate: directionTypePredicate,
      object: this.directionType,
      graph: this.storeOptions.sourceGraph,
    });

    triples.push({
      subject: tableEntryUri,
      predicate: approachTypePredicate,
      object: this.approachType,
      graph: this.storeOptions.sourceGraph,
    });

    triples.push({
      subject: tableEntryUri,
      predicate: kilometersPredicate,
      object: 0,
      graph: this.storeOptions.sourceGraph,
    });

    this.storeOptions.store.addAll(triples);
    this.setComponentValues(tableEntryUri);
  }

  setComponentValues(subject) {
    this.tableEntryUri = subject;
    this.kilometers = this.storeOptions.store.match(
      this.tableEntryUri,
      kilometersPredicate,
      null,
      this.storeOptions.sourceGraph
    )[0].object.value;
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
  update(e) {
    this.errors = [];
    if (e && typeof e.preventDefault === 'function') e.preventDefault();

    if (!this.isPositiveInteger(this.kilometers)) {
      this.errors.pushObject({
        message: 'Het aantal kilometers mag niet onder 0 liggen',
      });
      this.updateTripleObject(
        this.objectiveTableSubject,
        hasInvalidCellPredicate,
        true
      );
    } else {
      this.updateTripleObject(
        this.objectiveTableSubject,
        hasInvalidCellPredicate,
        null
      );
    }

    this.kilometers = this.kilometers.replace(/[^0-9/-]/g, '.');
    const parsedAmount = Number(this.kilometers);
    if (parsedAmount >= 0) {
      this.updateTripleObject(
        this.tableEntryUri,
        kilometersPredicate,
        rdflib.literal(parsedAmount)
      );
    }

    return this.onUpdateCell();
  }

  isPositiveInteger(value) {
    return parseInt(value) >= 0;
  }
}
