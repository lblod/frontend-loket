import Component from '@glimmer/component';
import { literal, NamedNode } from 'rdflib';
import { v4 as uuidv4 } from 'uuid';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { scheduleOnce } from '@ember/runloop';
import { removeSimpleFormValue } from '@lblod/submission-form-helpers';
import { MU, QB, RDF, XSD } from 'frontend-loket/rdf/namespaces';

const climateBaseUri = 'http://data.lblod.info/vocabularies/subsidie/climate/';
const climateTableBaseUri = 'http://data.lblod.info/climate-tables';

const tableEntryBaseUri = 'http://data.lblod.info/id/climate-table/row-entry';
const ClimateEntryType = new NamedNode(`${climateBaseUri}ClimateEntry`);
const climateEntryPredicate = new NamedNode(`${climateBaseUri}climateEntry`);
const climateEntryCustomAction = new NamedNode(`${climateBaseUri}customAction`);
const actionDescriptionPredicate = new NamedNode(
  `${climateBaseUri}actionDescription`
);
const amountPerActionPredicate = new NamedNode(
  `${climateBaseUri}amountPerAction`
);
const restitutionPredicate = new NamedNode(`${climateBaseUri}restitution`);
const hasInvalidRowPredicate = new NamedNode(
  `${climateTableBaseUri}/hasInvalidClimateTableEntry`
);
const customDescriptionPredicate = new NamedNode(
  `${climateBaseUri}customDescription`
);
const toRealiseUnitsPredicate = new NamedNode(
  `${climateBaseUri}toRealiseUnits`
);
const costPerUnitPredicate = new NamedNode(`${climateBaseUri}costPerUnit`);

export default class RdfFormFieldsClimateSubsidyCostsTableTableRowCustomDataComponent extends Component {
  id = guidFor(this);
  @tracked tableEntryUri = null;
  @tracked description = '';
  @tracked amount = null;
  @tracked restitution = null;
  @tracked toRealiseUnits = null;
  @tracked costPerUnit = null;
  @tracked descriptionErrors = [];
  @tracked toRealiseUnitsErrors = [];
  @tracked costPerUnitErrors = [];

  get storeOptions() {
    return this.args.storeOptions;
  }

  get businessRuleUri() {
    return this.args.businessRuleUri;
  }

  get climateTableSubject() {
    return this.args.climateTableSubject;
  }

  get hasValues() {
    const values = this.storeOptions.store.match(
      null,
      actionDescriptionPredicate,
      this.businessRuleUri,
      this.storeOptions.sourceGraph
    );
    return values.length;
  }

  constructor() {
    super(...arguments);
    scheduleOnce('actions', this, this.initializeTableRow);
  }

  initializeTableRow() {
    if (this.hasValues) {
      this.loadProvidedValue();
      this.args.updateTotalRestitution(this.restitution);
      this.args.onUpdateRow();
    } else {
      this.initializeDefault();
    }
  }

  loadProvidedValue() {
    const values = this.storeOptions.store.match(
      null,
      actionDescriptionPredicate,
      this.businessRuleUri,
      this.storeOptions.sourceGraph
    );
    if (values.length > 1) {
      throw `Expected single value for ${this.businessRuleUri}`;
    } else {
      this.setComponentValues(values[0].subject);
    }
  }

  setComponentValues(subject) {
    this.tableEntryUri = subject;
    this.description = this.storeOptions.store.match(
      this.tableEntryUri,
      customDescriptionPredicate,
      null,
      this.storeOptions.sourceGraph
    )[0].object.value;
    this.amount = this.storeOptions.store.match(
      this.tableEntryUri,
      amountPerActionPredicate,
      null,
      this.storeOptions.sourceGraph
    )[0].object.value;
    this.costPerUnit = this.storeOptions.store.match(
      this.tableEntryUri,
      costPerUnitPredicate,
      null,
      this.storeOptions.sourceGraph
    )[0].object.value;
    this.restitution = this.storeOptions.store.match(
      this.tableEntryUri,
      restitutionPredicate,
      null,
      this.storeOptions.sourceGraph
    )[0].object.value; // TODO: this seems to always return a string?
    this.toRealiseUnits = this.storeOptions.store.match(
      this.tableEntryUri,
      toRealiseUnitsPredicate,
      null,
      this.storeOptions.sourceGraph
    )[0].object.value;
  }

  initializeDefault() {
    const uuid = uuidv4();
    const tableEntryUri = new NamedNode(`${tableEntryBaseUri}/${uuid}`);

    let triples = [
      {
        subject: tableEntryUri,
        predicate: RDF('type'),
        object: ClimateEntryType,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: tableEntryUri,
        predicate: MU('uuid'),
        object: uuid,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: tableEntryUri,
        predicate: climateEntryCustomAction,
        object: true,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: this.climateTableSubject,
        predicate: climateEntryPredicate,
        object: tableEntryUri,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: tableEntryUri,
        predicate: actionDescriptionPredicate,
        object: this.businessRuleUri,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: tableEntryUri,
        predicate: customDescriptionPredicate,
        object: '',
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: tableEntryUri,
        predicate: costPerUnitPredicate,
        object: 0,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: tableEntryUri,
        predicate: amountPerActionPredicate,
        object: 0,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: tableEntryUri,
        predicate: restitutionPredicate,
        object: 0,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: tableEntryUri,
        predicate: toRealiseUnitsPredicate,
        object: 0,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: tableEntryUri,
        predicate: QB('order'),
        object: this.args.order,
        graph: this.storeOptions.sourceGraph,
      },
    ];

    this.storeOptions.store.addAll(triples);
    this.setComponentValues(tableEntryUri);
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

  isPositiveInteger(value) {
    return parseInt(value) >= 0;
  }

  isValidInteger(value) {
    return parseFloat(value) % 1 === 0;
  }

  @action
  update(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();

    let isValidDescription = this.validateDescription();
    let isValidToRealiseUnits = this.validateToRealiseUnits();
    let isValidCostPerUnit = this.validateCostPerUnit();

    if (isValidDescription && isValidToRealiseUnits && isValidCostPerUnit) {
      this.markRowAsValid();

      const amount = this.costPerUnit * this.toRealiseUnits;
      const currentRestitution = this.restitution;
      const newRestitution = amount / 2;

      this.updateTripleObject(
        this.tableEntryUri,
        customDescriptionPredicate,
        literal(this.description.trim())
      );
      this.updateTripleObject(
        this.tableEntryUri,
        toRealiseUnitsPredicate,
        literal(this.toRealiseUnits, XSD('integer'))
      );
      this.updateTripleObject(
        this.tableEntryUri,
        amountPerActionPredicate,
        literal(amount, XSD('integer'))
      );
      this.updateTripleObject(
        this.tableEntryUri,
        restitutionPredicate,
        literal(newRestitution, XSD('float'))
      );
      this.updateTripleObject(
        this.tableEntryUri,
        costPerUnitPredicate,
        literal(this.costPerUnit, XSD('float'))
      );
      this.setComponentValues(this.tableEntryUri);

      this.args.updateTotalRestitution(newRestitution - currentRestitution);
    } else {
      this.markRowAsInvalid();
    }

    return this.args.onUpdateRow();
  }

  @action
  deleteAction() {
    const triples = this.storeOptions.store.match(
      this.tableEntryUri,
      undefined,
      undefined,
      this.storeOptions.sourceGraph
    );

    if (triples.length) {
      this.storeOptions.store.removeStatements(triples);
    }
    removeSimpleFormValue(this.tableEntryUri, this.storeOptions); // remove hasPart

    this.markRowAsValid();

    // Add the value we removed from the total restitution
    this.args.updateTotalRestitution(-this.restitution);

    this.args.onDelete();
  }

  validateDescription() {
    let description = this.description.trim();
    this.descriptionErrors = [];

    if (description.length === 0) {
      this.descriptionErrors.push({
        message: 'Dit veld is verplicht.',
      });
      this.markRowAsInvalid();

      return false;
    }

    return true;
  }

  validateCostPerUnit() {
    let costPerUnit = this.costPerUnit;
    this.costPerUnitErrors = [];

    if (!this.isPositiveInteger(costPerUnit)) {
      this.costPerUnitErrors.push({
        message: 'Waarde per item moeten groter of gelijk aan 0 zijn.',
      });

      return false;
    }

    return true;
  }

  validateToRealiseUnits() {
    let toRealiseUnits = this.toRealiseUnits;
    this.toRealiseUnitsErrors = [];

    if (!this.isPositiveInteger(toRealiseUnits)) {
      this.toRealiseUnitsErrors.push({
        message: 'Aantal items moeten groter of gelijk aan 0 zijn.',
      });

      return false;
    } else if (!this.isValidInteger(toRealiseUnits)) {
      this.toRealiseUnitsErrors.push({
        message: 'Aantal items moeten een geheel getal vormen.',
      });

      return false;
    }

    return true;
  }

  markRowAsValid() {
    const triples = this.storeOptions.store.match(
      this.climateTableSubject,
      hasInvalidRowPredicate,
      this.tableEntryUri,
      this.storeOptions.sourceGraph
    );

    if (triples.length) {
      this.storeOptions.store.removeStatements(triples);
    }
  }

  markRowAsInvalid() {
    this.storeOptions.store.addAll([
      {
        subject: this.climateTableSubject,
        predicate: hasInvalidRowPredicate,
        object: this.tableEntryUri,
        graph: this.storeOptions.sourceGraph,
      },
    ]);
  }
}
