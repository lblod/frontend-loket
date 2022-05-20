import { tracked } from '@glimmer/tracking';

import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import { triplesForPath } from '@lblod/submission-form-helpers';
import rdflib from 'browser-rdflib';

export const MU = new rdflib.Namespace('http://mu.semte.ch/vocabularies/core/');

export const estimatedCostTableBaseUri =
  'http://lblod.data.gift/id/subsidie/bicycle-infrastructure/table';
export const bicycleInfrastructureUri =
  'http://lblod.data.gift/vocabularies/subsidie/bicycle-infrastructure#';
export const extBaseUri = 'http://mu.semte.ch/vocabularies/ext/';
export const subsidyRulesUri = 'http://data.lblod.info/id/subsidies/rules/';

export const EstimatedCostTableType = new rdflib.NamedNode(
  `${bicycleInfrastructureUri}EstimatedCostTable`
);
export const EstimatedCostEntryType = new rdflib.NamedNode(
  `${bicycleInfrastructureUri}EstimatedCostEntry`
);
export const estimatedCostTablePredicate = new rdflib.NamedNode(
  `${bicycleInfrastructureUri}estimatedCostTable`
);
export const estimatedCostEntryPredicate = new rdflib.NamedNode(
  `${bicycleInfrastructureUri}estimatedCostEntry`
);

export const descriptionPredicate = new rdflib.NamedNode(
  `${bicycleInfrastructureUri}costEstimationType`
);
export const costPredicate = new rdflib.NamedNode(
  `${bicycleInfrastructureUri}cost`
);
export const sharePredicate = new rdflib.NamedNode(
  `${bicycleInfrastructureUri}share`
);
export const indexPredicate = new rdflib.NamedNode(`${extBaseUri}index`);
export const validEstimatedCostTable = new rdflib.NamedNode(
  `${bicycleInfrastructureUri}validEstimatedCostTable`
);
export const optionsPredicate = new rdflib.NamedNode(
  'http://lblod.data.gift/vocabularies/forms/options'
);

export class EntryProperties {
  @tracked value;
  @tracked errors = [];

  constructor(value, predicate) {
    this.value = value;
    this.predicate = predicate;
    this.errors = [];
  }
}

export class EstimatedCostEntry {
  @tracked estimatedCostEntrySubject;

  constructor({ estimatedCostEntrySubject, description, cost, share, index }) {
    this.estimatedCostEntrySubject = estimatedCostEntrySubject;
    this.description = new EntryProperties(description, descriptionPredicate);
    this.cost = new EntryProperties(cost, costPredicate);
    this.share = new EntryProperties(share, sharePredicate);
    this.index = new EntryProperties(index, indexPredicate);
  }
}

export default class RdfFormFieldsEstimatedCostTableBaseTableComponent extends InputFieldComponent {
  @tracked estimatedCostTableSubject = null;
  @tracked entries = [];

  loadEstimatedCostEntries() {
    const estimatedCostEntries = [];
    const matches = triplesForPath(this.storeOptions);
    const triples = matches.triples;

    if (triples.length) {
      this.estimatedCostTableSubject = triples[0].object; // assuming only one per form

      const entriesMatches = triplesForPath({
        store: this.storeOptions.store,
        path: estimatedCostEntryPredicate,
        formGraph: this.storeOptions.formGraph,
        sourceNode: this.estimatedCostTableSubject,
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

          estimatedCostEntries.push(
            new EstimatedCostEntry({
              estimatedCostEntrySubject: entry.object,
              description: parsedEntry.description,
              cost: isNaN(parseInt(parsedEntry.cost)) ? 0 : parsedEntry.cost,
              share: isNaN(parseInt(parsedEntry.share))
                ? 100
                : parsedEntry.share,
              index: parsedEntry.index,
            })
          );

          estimatedCostEntries.sort((a, b) => a.index.value - b.index.value);
        }
      }
    }
    return estimatedCostEntries;
  }

  parseEntryProperties(entryProperties) {
    let entry = {};
    if (
      entryProperties.find(
        (entry) => entry.predicate.value == descriptionPredicate.value
      )
    )
      entry.description = entryProperties.find(
        (entry) => entry.predicate.value == descriptionPredicate.value
      ).object.value;
    if (
      entryProperties.find(
        (entry) => entry.predicate.value == costPredicate.value
      )
    )
      entry.cost = entryProperties.find(
        (entry) => entry.predicate.value == costPredicate.value
      ).object.value;
    if (
      entryProperties.find(
        (entry) => entry.predicate.value == sharePredicate.value
      )
    )
      entry.share = entryProperties.find(
        (entry) => entry.predicate.value == sharePredicate.value
      ).object.value;
    if (
      entryProperties.find(
        (entry) => entry.predicate.value == indexPredicate.value
      )
    )
      entry.index = entryProperties.find(
        (entry) => entry.predicate.value == indexPredicate.value
      ).object.value;
    return entry;
  }
}
