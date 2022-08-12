import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import { action } from '@ember/object';
import { triplesForPath } from '@lblod/submission-form-helpers';
import { scheduleOnce } from '@ember/runloop';
import { NamedNode, Namespace } from 'rdflib';
import { v4 as uuidv4 } from 'uuid';
import { RDF } from '@lblod/submission-form-helpers';

const MU = new Namespace('http://mu.semte.ch/vocabularies/core/');

const planBaseUri =
  'http://lblod.data.gift/vocabularies/subsidie/plan-samenleven/';
const planTableBaseUri = 'http://data.lblod.info/plan-living-together-tables';

const lblodSubsidieBaseUri = 'http://lblod.data.gift/vocabularies/subsidie/';
const planTableType = new NamedNode(
  `${lblodSubsidieBaseUri}PlanLivingTogetherTable`
);
const planTablePredicate = new NamedNode(
  `${lblodSubsidieBaseUri}planLivingTogetherTable`
);
const plannedRangePredicate = new NamedNode(`${planBaseUri}plannedRange`);
const contributionPredicate = new NamedNode(`${planBaseUri}contribution`);
const totalContributionPredicate = new NamedNode(
  `${planBaseUri}totalContribution`
);
const hasInvalidRowPredicate = new NamedNode(
  `${planTableBaseUri}hasInvalidPlanLivingTogetherTableEntry`
);
const validPlanTable = new NamedNode(
  `${lblodSubsidieBaseUri}validPlanLivingTogetherTable`
);

export default class RdfFormFieldsPlanLivingTogetherTableEditComponent extends InputFieldComponent {
  @tracked planTableSubject = null;
  @tracked errors = A();
  @tracked entries = [];
  @tracked totalContribution = 0;

  get hasPlanTable() {
    if (!this.planTableSubject) return false;
    else
      return (
        this.storeOptions.store.match(
          this.sourceNode,
          planTablePredicate,
          this.planTableSubject,
          this.storeOptions.sourceGraph
        ).length > 0
      );
  }

  constructor() {
    super(...arguments);
    scheduleOnce('actions', this, this.initializeTable);
  }

  loadProvidedValue() {
    const matches = triplesForPath(this.storeOptions);
    const triples = matches.triples;
    if (triples.length) {
      this.planTableSubject = triples[0].object; // assuming only one per form
    }
  }

  initializeTable() {
    this.loadProvidedValue();

    if (!this.hasPlanTable) {
      this.createPlanTable();
    }

    this.validate();
  }

  createPlanTable() {
    const uuid = uuidv4();
    this.planTableSubject = new NamedNode(`${planTableBaseUri}/${uuid}`);

    const triples = [
      {
        subject: this.planTableSubject,
        predicate: RDF('type'),
        object: planTableType,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: this.planTableSubject,
        predicate: MU('uuid'),
        object: uuid,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: this.storeOptions.sourceNode,
        predicate: planTablePredicate,
        object: this.planTableSubject,
        graph: this.storeOptions.sourceGraph,
      },
    ];
    this.storeOptions.store.addAll(triples);
  }

  //TODO: move to some common code
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
  validate() {
    this.errors = A();

    // Calculate total contribution (column D)
    const contributionEntries = this.storeOptions.store.match(
      undefined,
      contributionPredicate,
      undefined,
      this.storeOptions.sourceGraph
    );

    this.totalContribution = contributionEntries.reduce(
      (prev, curr) => prev + Number(curr.object.value),
      0
    );

    // check that at least 1 value set in column C
    const rangeEntries = this.storeOptions.store.match(
      undefined,
      plannedRangePredicate,
      undefined,
      this.storeOptions.sourceGraph
    );

    const invalidRow = this.storeOptions.store.any(
      this.planTableSubject,
      hasInvalidRowPredicate,
      null,
      this.storeOptions.sourceGraph
    );
    const hasPlannedRange = rangeEntries.filter(
      (entry) => parseInt(entry.object.value) > 0
    );

    if (invalidRow) {
      this.errors.pushObject({
        message: 'Een van de rijen is niet correct ingevuld',
      });
      this.updateTripleObject(this.planTableSubject, validPlanTable, null);
    } else if (!hasPlannedRange.length) {
      this.errors.pushObject({
        message:
          'Minstens één gepland bereik veld moet een waarde groter dan 0 bevatten.',
      });
      this.updateTripleObject(this.planTableSubject, validPlanTable, null);
    } else {
      this.updateTripleObject(
        this.planTableSubject,
        totalContributionPredicate,
        this.totalContribution
      );
      this.updateTripleObject(this.planTableSubject, validPlanTable, true);
    }
  }
}
