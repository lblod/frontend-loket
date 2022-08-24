import Component from '@glimmer/component';
import { literal, NamedNode } from 'rdflib';
import { v4 as uuidv4 } from 'uuid';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { RDF, XSD } from '@lblod/submission-form-helpers';
import { MU } from 'frontend-loket/rdf/namespaces';

const climateBaseUri = 'http://data.lblod.info/vocabularies/subsidie/climate/';
const climateTableBaseUri = 'http://data.lblod.info/climate-tables';

const tableEntryBaseUri = 'http://data.lblod.info/id/climate-table/row-entry';
const ClimateEntryType = new NamedNode(`${climateBaseUri}ClimateEntry`);
const climateEntryPredicate = new NamedNode(`${climateBaseUri}climateEntry`);
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
const toRealiseUnitsPredicate = new NamedNode(
  `${climateBaseUri}toRealiseUnits`
);
const costPerUnitPredicate = new NamedNode(`${climateBaseUri}costPerUnit`);

export default class RdfFormFieldsClimateSubsidyCostsTableTableRowWerfComponent extends Component {
  @tracked tableEntryUri = null;
  @tracked amount = null;
  @tracked restitution = null;
  @tracked toRealiseUnits = null;
  @tracked costPerUnit = null;
  @tracked toRealiseUnitsErrors = A();
  @tracked costPerUnitErrors = A();
  @tracked isValidRow = true;

  get storeOptions() {
    return this.args.storeOptions;
  }

  get businessRuleUri() {
    return new NamedNode(this.args.businessRuleUriStr);
  }

  get climateTableSubject() {
    return this.args.climateTableSubject;
  }

  get onUpdateRow() {
    return this.args.onUpdateRow;
  }

  constructor() {
    super(...arguments);
    scheduleOnce('actions', this, this.initializeTableRow);
  }

  initializeTableRow() {
    if (this.hasValues()) {
      this.loadProvidedValue();
      this.args.updateTotalRestitution(this.restitution);
      this.onUpdateRow();
    } else {
      this.initializeDefault();
    }
  }

  hasValues() {
    const values = this.storeOptions.store.match(
      null,
      actionDescriptionPredicate,
      this.businessRuleUri,
      this.storeOptions.sourceGraph
    );
    return values.length;
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
    )[0].object.value;
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
    ];

    triples.push({
      subject: tableEntryUri,
      predicate: costPerUnitPredicate,
      object: 0,
      graph: this.storeOptions.sourceGraph,
    });

    triples.push({
      subject: tableEntryUri,
      predicate: amountPerActionPredicate,
      object: 0,
      graph: this.storeOptions.sourceGraph,
    });

    triples.push({
      subject: tableEntryUri,
      predicate: restitutionPredicate,
      object: 0,
      graph: this.storeOptions.sourceGraph,
    });

    triples.push({
      subject: tableEntryUri,
      predicate: toRealiseUnitsPredicate,
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

  validateToRealiseUnits(toRealiseUnits) {
    this.toRealiseUnitsErrors = A();

    if (!this.isPositiveInteger(toRealiseUnits)) {
      this.toRealiseUnitsErrors.pushObject({
        message: 'Aantal items moeten groter of gelijk aan 0 zijn.',
      });
      this.updateTripleObject(
        this.climateTableSubject,
        hasInvalidRowPredicate,
        this.tableEntryUri
      );
      return false;
    } else if (!this.isValidInteger(toRealiseUnits)) {
      this.toRealiseUnitsErrors.pushObject({
        message: 'Aantal items moeten een geheel getal vormen.',
      });
      this.updateTripleObject(
        this.climateTableSubject,
        hasInvalidRowPredicate,
        this.tableEntryUri
      );
      return false;
    }

    //OpstartTraject lokale energiegemeentschap
    else if (
      toRealiseUnits > 1 &&
      'http://data.lblod.info/id/subsidies/rules/38d6d2bd-e42b-4d7e-8fea-9a371d9cf22f' ==
        this.businessRuleUri.value
    ) {
      this.toRealiseUnitsErrors.pushObject({
        message:
          'Er is maximaal 1 te realiseren item mogelijk voor deze actie.',
      });
      this.updateTripleObject(
        this.climateTableSubject,
        hasInvalidRowPredicate,
        this.tableEntryUri
      );
      return false;
    } else {
      this.updateTripleObject(
        this.climateTableSubject,
        hasInvalidRowPredicate,
        null
      );
      return true;
    }
  }

  validateCostPerUnit(valuePerItem) {
    this.costPerUnitErrors = A();

    if (!this.isPositiveInteger(valuePerItem)) {
      this.costPerUnitErrors.pushObject({
        message: 'Waarde per item moeten groter of gelijk aan 0 zijn.',
      });
      this.updateTripleObject(
        this.climateTableSubject,
        hasInvalidRowPredicate,
        this.tableEntryUri
      );
      return false;
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

    /** start validation **/
    this.validateToRealiseUnits(this.toRealiseUnits);
    this.validateCostPerUnit(this.costPerUnit);

    if (this.costPerUnitErrors.length) return this.onUpdateRow();
    if (this.toRealiseUnitsErrors.length) return this.onUpdateRow();
    /** end validation **/

    const amount = this.costPerUnit * this.toRealiseUnits;
    const currentRestitution = this.restitution;
    const newRestitution = amount / 2;

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

    // Updates the "Trekkingsrecht te verdelen" value
    this.args.updateTotalRestitution(newRestitution - currentRestitution);
    return this.onUpdateRow();
  }
}
