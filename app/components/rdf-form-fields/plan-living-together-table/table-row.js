import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import { action } from '@ember/object';
import { literal, NamedNode } from 'rdflib';
import { scheduleOnce } from '@ember/runloop';
import { v4 as uuidv4 } from 'uuid';
import { MU, RDF, XSD } from 'frontend-loket/rdf/namespaces';

const planBaseUri =
  'http://lblod.data.gift/vocabularies/subsidie/plan-samenleven/';
const planTableBaseUri = 'http://data.lblod.info/plan-living-together-tables';

const tableEntryBaseUri =
  'http://data.lblod.info/id/plan-living-together-table/row-entry';
const PlanEntryType = new NamedNode(`${planBaseUri}PlanLivingTogetherEntry`);
const planEntryPredicate = new NamedNode(
  `${planBaseUri}planLivingTogetherEntry`,
);
const descriptionPredicate = new NamedNode(`${planBaseUri}description`);
const currentRangePredicate = new NamedNode(`${planBaseUri}currentRange`);
const plannedRangePredicate = new NamedNode(`${planBaseUri}plannedRange`);
const contributionPredicate = new NamedNode(`${planBaseUri}contribution`);
const priorityPredicate = new NamedNode(`${planBaseUri}priority`);
const hasInvalidRowPredicate = new NamedNode(
  `${planTableBaseUri}hasInvalidPlanLivingTogetherTableEntry`,
);

export default class RdfFormFieldsPlanLivingTogetherTableTableRowComponent extends Component {
  @tracked tableEntryUri = null;
  @tracked currentRange = null;
  @tracked plannedRange = null;
  @tracked priority = null;

  @tracked currentRangeErrors = A();
  @tracked plannedRangeErrors = A();
  @tracked priorityErrors = A();

  get storeOptions() {
    return this.args.storeOptions;
  }

  get planTableSubject() {
    return this.args.planTableSubject;
  }

  get businessRuleUri() {
    return new NamedNode(this.args.businessRuleUriStr);
  }

  get onUpdateRow() {
    return this.args.onUpdateRow;
  }

  get multiplier() {
    return this.args.multiplier;
  }

  get maxRange() {
    return this.args.maxRange;
  }

  get contribution() {
    return this.plannedRange * this.multiplier;
  }

  constructor() {
    super(...arguments);
    scheduleOnce('actions', this, this.initializeTableRow);
  }

  initializeTableRow() {
    if (this.hasValues()) {
      this.loadProvidedValue();
      this.onUpdateRow();
    } else {
      this.initializeDefault();
    }
  }

  hasValues() {
    const values = this.storeOptions.store.match(
      null,
      descriptionPredicate,
      this.businessRuleUri,
      this.storeOptions.sourceGraph,
    );
    return values.length;
  }

  loadProvidedValue() {
    const values = this.storeOptions.store.match(
      null,
      descriptionPredicate,
      this.businessRuleUri,
      this.storeOptions.sourceGraph,
    );
    if (values.length > 1) {
      throw `Expected single value for ${this.businessRuleUri}`;
    } else {
      this.setComponentValues(values[0].subject);
    }
  }

  setComponentValues(subject) {
    this.tableEntryUri = subject;

    this.currentRange = this.storeOptions.store.match(
      this.tableEntryUri,
      currentRangePredicate,
      null,
      this.storeOptions.sourceGraph,
    )[0].object.value;
    this.plannedRange = this.storeOptions.store.match(
      this.tableEntryUri,
      plannedRangePredicate,
      null,
      this.storeOptions.sourceGraph,
    )[0].object.value;
    this.priority = this.storeOptions.store.match(
      this.tableEntryUri,
      priorityPredicate,
      null,
      this.storeOptions.sourceGraph,
    )[0].object.value;

    this.convertInputValuesToNumbers();
  }

  initializeDefault() {
    const uuid = uuidv4();
    const tableEntryUri = new NamedNode(`${tableEntryBaseUri}/${uuid}`);

    let triples = [
      {
        subject: tableEntryUri,
        predicate: RDF('type'),
        object: PlanEntryType,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: tableEntryUri,
        predicate: MU('uuid'),
        object: uuid,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: this.planTableSubject,
        predicate: planEntryPredicate,
        object: tableEntryUri,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: tableEntryUri,
        predicate: descriptionPredicate,
        object: this.businessRuleUri,
        graph: this.storeOptions.sourceGraph,
      },
    ];

    triples.push({
      subject: tableEntryUri,
      predicate: currentRangePredicate,
      object: 0,
      graph: this.storeOptions.sourceGraph,
    });

    triples.push({
      subject: tableEntryUri,
      predicate: plannedRangePredicate,
      object: 0,
      graph: this.storeOptions.sourceGraph,
    });

    triples.push({
      subject: tableEntryUri,
      predicate: priorityPredicate,
      object: 0,
      graph: this.storeOptions.sourceGraph,
    });

    this.storeOptions.store.addAll(triples);
    this.setComponentValues(tableEntryUri);
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

  validateCurrentRange(currentRange) {
    this.currentRangeErrors = A();

    if (!this.isPositiveInteger(currentRange)) {
      this.currentRangeErrors.pushObject({
        message: 'De waarde moet groter of gelijk aan 0 zijn.',
      });
      this.updateTripleObject(
        this.planTableSubject,
        hasInvalidRowPredicate,
        this.tableEntryUri,
      );
      return false;
    } else if (!this.isValidInteger(currentRange)) {
      this.currentRangeErrors.pushObject({
        message: 'De waarde moet een geheel getal vormen.',
      });
      this.updateTripleObject(
        this.planTableSubject,
        hasInvalidRowPredicate,
        this.tableEntryUri,
      );
      return false;
    }
  }

  validatePlannedRange(plannedRange) {
    this.plannedRangeErrors = A();

    if (!this.isPositiveInteger(plannedRange)) {
      this.plannedRangeErrors.pushObject({
        message: 'De waarde moet groter of gelijk aan 0 zijn.',
      });
      this.updateTripleObject(
        this.planTableSubject,
        hasInvalidRowPredicate,
        this.tableEntryUri,
      );
      return false;
    } else if (!this.isValidInteger(plannedRange)) {
      this.plannedRangeErrors.pushObject({
        message: 'De waarde moet een geheel getal vormen.',
      });
      this.updateTripleObject(
        this.planTableSubject,
        hasInvalidRowPredicate,
        this.tableEntryUri,
      );
      return false;
    } else if (plannedRange > this.maxRange) {
      this.plannedRangeErrors.pushObject({
        message: `De waarde mag niet hoger liggen dan ${this.maxRange}.`,
      });
      this.updateTripleObject(
        this.planTableSubject,
        hasInvalidRowPredicate,
        this.tableEntryUri,
      );
      return false;
    }
  }

  validatePriority(priority) {
    this.priorityErrors = A();

    if (this.plannedRange > 0 && this.priority == 0) {
      this.priorityErrors.pushObject({
        message: 'Gelieve een waarde groter dan 0 in te geven.',
      });
      this.updateTripleObject(
        this.planTableSubject,
        hasInvalidRowPredicate,
        this.tableEntryUri,
      );
      return false;
    } else if (!this.isPositiveInteger(priority)) {
      this.priorityErrors.pushObject({
        message: 'De waarde moet groter of gelijk aan 0 zijn.',
      });
      this.updateTripleObject(
        this.planTableSubject,
        hasInvalidRowPredicate,
        this.tableEntryUri,
      );
      return false;
    } else if (!this.isValidInteger(priority)) {
      this.priorityErrors.pushObject({
        message: 'De waarde moet een geheel getal vormen.',
      });
      this.updateTripleObject(
        this.planTableSubject,
        hasInvalidRowPredicate,
        this.tableEntryUri,
      );
      return false;
    }
  }

  @action
  update(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();

    this.updateTripleObject(
      this.planTableSubject,
      hasInvalidRowPredicate,
      null,
    );

    this.convertInputValuesToNumbers();

    /** start validation **/
    this.validateCurrentRange(this.currentRange);
    this.validatePlannedRange(this.plannedRange);
    this.validatePriority(this.priority);

    if (this.currentRangeErrors.length) return this.onUpdateRow();
    if (this.plannedRangeErrors.length) return this.onUpdateRow();
    if (this.priorityErrors.length) return this.onUpdateRow();
    /** end validation **/

    this.updateTripleObject(
      this.tableEntryUri,
      currentRangePredicate,
      literal(this.currentRange, XSD('integer')),
    );
    this.updateTripleObject(
      this.tableEntryUri,
      plannedRangePredicate,
      literal(this.plannedRange, XSD('integer')),
    );
    this.updateTripleObject(
      this.tableEntryUri,
      contributionPredicate,
      literal(this.contribution, XSD('float')),
    );
    this.updateTripleObject(
      this.tableEntryUri,
      priorityPredicate,
      literal(this.priority, XSD('integer')),
    );
    this.setComponentValues(this.tableEntryUri);

    return this.onUpdateRow();
  }

  /**
   * Both rdflib and <Input>'s 2-way-binding return strings, so we convert everything to numbers
   */
  convertInputValuesToNumbers() {
    this.currentRange = !isNaN(parseFloat(this.currentRange))
      ? parseFloat(this.currentRange)
      : 0;

    this.plannedRange = !isNaN(parseFloat(this.plannedRange))
      ? parseFloat(this.plannedRange)
      : 0;

    this.priority = !isNaN(parseFloat(this.priority))
      ? parseFloat(this.priority)
      : 0;
  }

  isPositiveInteger(value) {
    return value >= 0;
  }

  isValidInteger(value) {
    return value % 1 === 0;
  }
}
