import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { NamedNode } from 'rdflib';
import { v4 as uuidv4 } from 'uuid';
import { RDF } from '@lblod/submission-form-helpers';
import { next } from '@ember/runloop';

import BaseTable from './base-table';
import { EstimatedCostEntry } from './base-table';
import {
  estimatedCostTableBaseUri,
  EstimatedCostTableType,
  estimatedCostTablePredicate,
  subsidyRulesUri,
  EstimatedCostEntryType,
  estimatedCostEntryPredicate,
  costPredicate,
  validEstimatedCostTable,
} from './base-table';
import { MU } from 'frontend-loket/rdf/namespaces';

import commasToDecimalPointsFix from '../../../helpers/subsidies/subsidies-decimal-point';

const defaultRows = [
  {
    uuid: 'bda9c645-9520-44ff-bac4-8b77647a93e0',
    description:
      'Totale raming van de kostprijs excl. BTW (enkel subsidieerbare kosten) en excl. onteigeningsvergoedingen',
    cost: 0,
    share: 100,
    index: 0,
  },
  {
    uuid: '38f24b3d-e4dd-408e-a530-c8d3a8fca0ff',
    description: 'Totale raming van de onteigeningsvergoedingen',
    cost: 0,
    share: 100,
    index: 1,
  },
];

const aanvraagRows = [
  {
    uuid: 'b22a9324-874a-42d1-b815-f20f96b31a53',
    description:
      'Kostprijs excl. BTW (enkel subsidieerbare kosten) en excl. onteigeningsvergoedingen',
    cost: 0,
    share: 100,
    index: 0,
  },
  {
    uuid: '92a25430-ab31-46dc-a0d8-3f4cf1dc1b04',
    description: 'Onteigeningsvergoedingen',
    cost: 0,
    share: 100,
    index: 1,
  },
];

export default class RdfFormFieldsEstimatedCostTableEditComponent extends BaseTable {
  @tracked errors = [];

  constructor() {
    super(...arguments);

    // There is a lot of stuff that get's updated in the same runloop, we'll need to revise this a bit
    // Now the workaround is to schedule it.
    next(this, () => {
      this.entries = this.loadEstimatedCostEntries();
      this.initializeTable();
      this.validate();
    });
  }

  get hasEstimatedCostTable() {
    if (!this.estimatedCostTableSubject) return false;
    else
      return (
        this.storeOptions.store.match(
          this.sourceNode,
          estimatedCostTablePredicate,
          this.estimatedCostTableSubject,
          this.storeOptions.sourceGraph
        ).length > 0
      );
  }

  get isAanvraagStep() {
    return Boolean(this.args.field?.options?.isAanvraagStep);
  }

  initializeTable() {
    if (!this.hasEstimatedCostTable) {
      this.createEstimatedCostTable();
      this.entries = this.createEntries();
    }
  }

  createEstimatedCostTable() {
    const uuid = uuidv4();
    this.estimatedCostTableSubject = new NamedNode(
      `${estimatedCostTableBaseUri}/${uuid}`
    );
    const triples = [
      {
        subject: this.estimatedCostTableSubject,
        predicate: RDF('type'),
        object: EstimatedCostTableType,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: this.estimatedCostTableSubject,
        predicate: MU('uuid'),
        object: uuid,
        graph: this.storeOptions.sourceGraph,
      },
      {
        subject: this.storeOptions.sourceNode,
        predicate: estimatedCostTablePredicate,
        object: this.estimatedCostTableSubject,
        graph: this.storeOptions.sourceGraph,
      },
    ];
    this.storeOptions.store.addAll(triples);
  }

  createEntries() {
    let entries = [];
    const estimatedCostEntriesDetails = this.createEstimatedCostEntries();
    estimatedCostEntriesDetails.forEach((detail) => {
      const newEntry = new EstimatedCostEntry({
        estimatedCostEntrySubject: detail.subject,
        description: detail.description,
        cost: detail.cost,
        share: detail.share,
        index: detail.index,
      });
      entries.pushObject(newEntry);
    });

    this.initializeEntriesFields(entries);
    return entries;
  }

  createEstimatedCostEntries() {
    let triples = [];
    let estimatedCostEntriesDetails = [];
    let rows = [];

    if (this.isAanvraagStep) {
      rows = aanvraagRows;
    } else {
      rows = defaultRows;
    }

    rows.forEach((target) => {
      const uuid = uuidv4();
      const estimatedCostEntrySubject = new NamedNode(
        `${subsidyRulesUri}/${uuid}`
      );

      estimatedCostEntriesDetails.push({
        subject: estimatedCostEntrySubject,
        description: target.description,
        cost: target.cost,
        share: target.share,
        index: target.index,
      });

      triples.push(
        {
          subject: estimatedCostEntrySubject,
          predicate: RDF('type'),
          object: EstimatedCostEntryType,
          graph: this.storeOptions.sourceGraph,
        },
        {
          subject: estimatedCostEntrySubject,
          predicate: MU('uuid'),
          object: target.uuid,
          graph: this.storeOptions.sourceGraph,
        },
        {
          subject: this.estimatedCostTableSubject,
          predicate: estimatedCostEntryPredicate,
          object: estimatedCostEntrySubject,
          graph: this.storeOptions.sourceGraph,
        }
      );
    });
    this.storeOptions.store.addAll(triples);
    return estimatedCostEntriesDetails;
  }

  initializeEntriesFields(entries) {
    let triples = [];
    entries.forEach((entry) => {
      triples.push(
        {
          subject: entry.estimatedCostEntrySubject,
          predicate: entry['description'].predicate,
          object: entry['description'].value,
          graph: this.storeOptions.sourceGraph,
        },
        {
          subject: entry.estimatedCostEntrySubject,
          predicate: entry['cost'].predicate,
          object: entry['cost'].value,
          graph: this.storeOptions.sourceGraph,
        },
        {
          subject: entry.estimatedCostEntrySubject,
          predicate: entry['share'].predicate,
          object: entry['share'].value,
          graph: this.storeOptions.sourceGraph,
        },
        {
          subject: entry.estimatedCostEntrySubject,
          predicate: entry['index'].predicate,
          object: entry['index'].value,
          graph: this.storeOptions.sourceGraph,
        }
      );
    });
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

  validate() {
    this.errors = [];
    const entries = this.storeOptions.store.match(
      undefined,
      costPredicate,
      undefined,
      this.storeOptions.sourceGraph
    );

    const invalidCosts = entries.filter((entry) =>
      isNaN(parseInt(entry.object.value))
    );
    if (invalidCosts.length) {
      this.errors.pushObject({
        message: 'Eén van de velden werd niet correct ingevuld.',
      });
      this.updateTripleObject(
        this.estimatedCostTableSubject,
        validEstimatedCostTable,
        null
      );
    }

    const positiveCosts = entries.filter(
      (entry) => parseInt(entry.object.value) > 0
    );
    if (!positiveCosts.length) {
      this.errors.pushObject({
        message:
          'Minstens één kosten veld moet een waarde groter dan 0 bevatten.',
      });
      this.updateTripleObject(
        this.estimatedCostTableSubject,
        validEstimatedCostTable,
        null
      );
    }

    if (positiveCosts.length && !invalidCosts.length) {
      this.updateTripleObject(
        this.estimatedCostTableSubject,
        validEstimatedCostTable,
        true
      );
    }
  }

  @action
  updateCost(entry) {
    entry.cost.errors = [];

    if (!this.isPositiveInteger(entry.cost.value)) {
      entry.cost.errors.pushObject({
        message: 'Kosten moet groter of gelijk aan 0 zijn',
      });
      this.updateTripleObject(
        this.estimatedCostTableSubject,
        validEstimatedCostTable,
        null
      );
    } else {
      this.updateTripleObject(
        this.estimatedCostTableSubject,
        validEstimatedCostTable,
        true
      );
    }

    entry['cost'].value = commasToDecimalPointsFix(entry['cost'].value);

    if (isNaN(parseInt(entry.cost.value))) {
      this.updateTripleObject(
        entry.estimatedCostEntrySubject,
        entry['cost'].predicate,
        'Field is empty'
      );
    } else if (parseInt(entry.cost.value) < 0) {
      this.updateTripleObject(
        entry.estimatedCostEntrySubject,
        entry['cost'].predicate,
        'Field is negative'
      );
    } else {
      this.updateTripleObject(
        entry.estimatedCostEntrySubject,
        entry['cost'].predicate,
        entry['cost'].value
      );
    }

    this.validate();
  }

  @action
  updateShare(entry) {
    entry.share.errors = [];
    entry['share'].value = commasToDecimalPointsFix(entry['share'].value);
    if (this.isEmpty(entry.share.value)) {
      entry.share.errors.pushObject({
        message: 'Gemeentelijk aandeel in kosten is verplicht.',
      });
      this.updateTripleObject(
        this.estimatedCostTableSubject,
        validEstimatedCostTable,
        null
      );
    } else if (!this.isPositiveInteger(Number(entry.share.value))) {
      entry.share.errors.pushObject({
        message:
          'Het gemeentelijke aandeel in kosten moet groter of gelijk aan 0 zijn',
      });
      this.updateTripleObject(
        this.estimatedCostTableSubject,
        validEstimatedCostTable,
        null
      );
    } else if (!this.isSmallerThan(Number(entry.share.value), 100)) {
      entry.share.errors.pushObject({
        message:
          'Het gemeentelijke aandeel in kosten mag niet hoger liggen dan 100%',
      });
      this.updateTripleObject(
        this.estimatedCostTableSubject,
        validEstimatedCostTable,
        null
      );
    } else {
      this.updateTripleObject(
        this.estimatedCostTableSubject,
        validEstimatedCostTable,
        true
      );
    }

    if (
      parseInt(entry.share.value) <= 100 &&
      parseInt(entry.share.value) >= 0
    ) {
      this.updateTripleObject(
        entry.estimatedCostEntrySubject,
        entry['share'].predicate,
        entry['share'].value
      );
    }
  }

  isPositiveInteger(value) {
    return parseInt(value) >= 0;
  }

  isEmpty(value) {
    return value.toString().length == 0;
  }

  isValidInteger(value) {
    return parseFloat(value) % 1 === 0;
  }

  isSmallerThan(value, max) {
    return value <= max;
  }
}
