import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import { action } from '@ember/object';
import { triplesForPath } from '@lblod/submission-form-helpers';
import { scheduleOnce } from '@ember/runloop';
import { NamedNode } from 'rdflib';
import { v4 as uuidv4 } from 'uuid';
import {
  DBPEDIA,
  LBLOD_SUBSIDIE,
  MU,
  RDF,
} from 'frontend-loket/rdf/namespaces';

const climateTableBaseUri = 'http://data.lblod.info/climate-tables';
const lblodSubsidieBaseUri = 'http://lblod.data.gift/vocabularies/subsidie/';
const climateBaseUri = 'http://data.lblod.info/vocabularies/subsidie/climate/';

const climateTableType = new NamedNode(`${lblodSubsidieBaseUri}ClimateTable`);
const climateTablePredicate = new NamedNode(
  `${lblodSubsidieBaseUri}climateTable`,
);
const hasInvalidRowPredicate = new NamedNode(
  `${climateTableBaseUri}/hasInvalidClimateTableEntry`,
);
const validClimateTable = new NamedNode(
  `${lblodSubsidieBaseUri}validClimateTable`,
);
const totalBudgettedAmount = new NamedNode(
  `${lblodSubsidieBaseUri}totalBudgettedAmount`,
);
const allowNewActions = new NamedNode(`${climateTableBaseUri}/allowNewActions`);
const climateEntryCustomAction = new NamedNode(`${climateBaseUri}customAction`);

/*
 * Component wrapping the big subsidy table for climate action.
 * Some notes
 *  ---------
 * - The business rule URI are in the database. So if the rules change, you will have to maintain these too.
 *   In that case, you will have to create a new instance of a business rule.
 *   -  Please note, they mainly are stored as documentation, so we know what numbers mean when making reports.
 *   - Your main question is, why don't use this information to render data in the components?
 *     Well, NOW, this could be considered, but when we started, the rules were more complicated and given
 *     the huge time constraints, the unknow randomness of the upcoming changes in rules,
 *     we didn't want to lock ourselves to engineering a solution that wouldn't work for an custom rule.
 *     So yes, this implies double bookkeeping. And hopefuly we can refactor this a bit.
 *    - The same argumentation is valid for the custom rows here. Yes, these could be abstracted NOW, but that wasn't the case a the start.
 */
export default class RdfFormFieldsClimateSubsidyCostsTableComponent extends InputFieldComponent {
  @tracked climateTableSubject = null;
  @tracked entries = A();
  @tracked restitutionToDestribute;
  @tracked errors = A();
  @tracked populationCount;
  @tracked drawingRight;
  @tracked climateTwo = false;
  @tracked customActions = [];
  orderCounter = 0;

  get hasClimateTable() {
    if (!this.climateTableSubject) return false;
    else
      return (
        this.storeOptions.store.match(
          this.sourceNode,
          climateTablePredicate,
          this.climateTableSubject,
          this.storeOptions.sourceGraph,
        ).length > 0
      );
  }

  get canAddNewActions() {
    if (this.args.show) {
      return false;
    }

    let triples = this.args.formStore.match(
      undefined,
      allowNewActions,
      undefined,
      this.args.graphs.formGraph,
    );

    if (triples.length > 0) {
      return triples[0].object.value === '1';
    } else {
      return false;
    }
  }

  constructor() {
    super(...arguments);
    scheduleOnce('actions', this, this.initializeTable);
  }

  initializeTable() {
    this.loadProvidedValue();

    if (!this.hasClimateTable) {
      this.createClimateTable();
    }

    this.validate();
  }

  loadProvidedValue() {
    const matches = triplesForPath(this.storeOptions);
    const triples = matches.triples;

    if (triples.length) {
      this.climateTableSubject = triples[0].object; // assuming only one per form
    }

    const metaGraph = this.args.graphs.metaGraph;
    this.populationCount = this.args.formStore.match(
      undefined,
      DBPEDIA('populationTotal'),
      undefined,
      metaGraph,
    )[0].object.value;

    const drawingRight = this.args.formStore.match(
      undefined,
      LBLOD_SUBSIDIE('drawingRight'),
      undefined,
      metaGraph,
    )[0].object.value;

    const lekpValidation =
      this.args.formStore.match(
        undefined,
        LBLOD_SUBSIDIE('lekp'),
        undefined,
        metaGraph,
      )[0]?.object?.value || '1.0';

    this.drawingRight = drawingRight;
    this.restitutionToDestribute = drawingRight;
    this.climateTwo = lekpValidation == '2.0';

    this.loadCustomActions();
  }

  loadCustomActions() {
    let store = this.args.formStore;
    let sourceGraph = this.args.graphs.sourceGraph;

    let triples = store.match(
      undefined,
      climateEntryCustomAction,
      undefined,
      sourceGraph,
    );

    if (triples.length > 0) {
      let tableEntryUris = triples.map((result) => {
        return result.subject;
      });

      this.customActions = tableEntryUris
        .map((entryUri) => {
          let triples = store.match(entryUri, undefined, undefined);

          let order = triples.find(
            ({ predicate }) =>
              predicate.value === 'http://purl.org/linked-data/cube#order',
          )?.object.value;
          order = parseInt(order);

          let businessRuleUri = triples.find(
            ({ predicate }) =>
              predicate.value === `${climateBaseUri}actionDescription`,
          )?.object;

          return {
            businessRuleUri,
            order,
          };
        })
        .sort(sortByOrder);
    }
  }

  createClimateTable() {
    const uuid = uuidv4();
    this.climateTableSubject = new NamedNode(`${climateTableBaseUri}/${uuid}`);
    const triples = [
      {
        subject: this.climateTableSubject,
        predicate: RDF('type'),
        object: climateTableType,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: this.climateTableSubject,
        predicate: MU('uuid'),
        object: uuid,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: this.storeOptions.sourceNode,
        predicate: climateTablePredicate,
        object: this.climateTableSubject,
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
  updateTotaleRestitution(value) {
    this.restitutionToDestribute = this.restitutionToDestribute - value;
    const totalBudgettedAmountValue = (
      this.drawingRight - this.restitutionToDestribute
    ).toFixed(2);
    this.updateTripleObject(
      this.climateTableSubject,
      totalBudgettedAmount,
      totalBudgettedAmountValue,
    );
  }

  @action
  validate() {
    this.errors = A();
    const invalidRow = this.storeOptions.store.any(
      this.climateTableSubject,
      hasInvalidRowPredicate,
      null,
      this.storeOptions.sourceGraph,
    );
    if (invalidRow) {
      this.errors.pushObject({
        message: 'Een van de rijen is niet correct ingevuld',
      });
      this.updateTripleObject(
        this.climateTableSubject,
        validClimateTable,
        null,
      );
    } else if (!this.isPositiveInteger(this.restitutionToDestribute)) {
      this.errors.pushObject({
        message: 'Trekkingsrecht te verdelen moet groter of gelijk aan 0 zijn',
      });
      this.updateTripleObject(
        this.climateTableSubject,
        validClimateTable,
        null,
      );
    } else {
      this.updateTripleObject(
        this.climateTableSubject,
        validClimateTable,
        true,
      );
    }
  }

  @action
  addNewAction() {
    let uuid = uuidv4();

    let highestOrderValue = this.customActions.length
      ? this.customActions[this.customActions.length - 1].order
      : 0;

    this.customActions = [
      ...this.customActions,
      {
        businessRuleUri: new NamedNode(
          `http://data.lblod.info/id/subsidies/rules/custom/${uuid}`,
        ),
        order: highestOrderValue + 1,
      },
    ];
  }

  @action
  removeCustomAction(actionToRemove) {
    this.customActions = this.customActions.filter(
      (action) => action !== actionToRemove,
    );
    this.validate();
  }

  isPositiveInteger(value) {
    return parseInt(value) >= 0;
  }
}

function sortByOrder(actionA, actionB) {
  return actionA?.order - actionB?.order;
}
