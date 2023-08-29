import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import {
  triplesForPath,
  updateSimpleFormValue,
  removeDatasetForSimpleFormValue,
} from '@lblod/submission-form-helpers';
import { restartableTask, timeout } from 'ember-concurrency';
import { NamedNode } from 'rdflib';
import PowerSelect from 'ember-power-select/components/power-select';
import PowerSelectMultiple from 'ember-power-select/components/power-select-multiple';

export default class RdfFormFieldsConceptSchemeSelectorComponent extends InputFieldComponent {
  @service store;

  @tracked selected = null;
  options = [];
  inputId = 'concept-selector-' + guidFor(this);

  constructor() {
    super(...arguments);
    this.loadSelectOptions();
    this.loadPersistedValues();
  }

  get shouldPreloadData() {
    return this.args.field.options.preload ?? true;
  }

  get isSearchEnabled() {
    return this.args.field.options.search ?? true;
  }

  get isBackendSearch() {
    return this.args.field.options.backendSearch ?? true;
  }

  get searchMessage() {
    return this.args.field.options.searchMessage || 'Typ om te zoeken';
  }

  get isMultiSelect() {
    return Boolean(this.args.field.options.multiple);
  }

  get selectComponent() {
    return this.isMultiSelect ? PowerSelectMultiple : PowerSelect;
  }

  loadSelectOptions() {
    if (this.shouldPreloadData) {
      this.options = this.loadConcepts();
    }
  }

  loadConcepts(query = {}) {
    let { conceptScheme, preloadAmount = 20 } = this.args.field.options;

    return this.store.query('concept', {
      'filter[concept-schemes][:uri:]': conceptScheme,
      sort: 'label',
      'page[size]': preloadAmount,
      ...query,
    });
  }

  async loadPersistedValues() {
    const matches = triplesForPath(this.storeOptions).values;

    if (matches.length > 0) {
      if (this.isMultiSelect) {
        let conceptPromises = matches.map(async (concept) => {
          let conceptUri = concept.value;
          return await this.loadConceptRecordByUri(conceptUri);
        });

        let concepts = await Promise.all(conceptPromises);
        this.selected = sortByLabel(concepts);
      } else {
        let conceptUri = matches[0].value;
        this.selected = await this.loadConceptRecordByUri(conceptUri);
      }
    }
  }

  async loadConceptRecordByUri(uri) {
    let response = await this.store.query('concept', {
      'filter[:uri:]': uri,
    });

    return response.at(0);
  }

  @action
  updateSelection(newSelection) {
    this.selected = newSelection;

    // Cleanup old value(s) in the store
    const matches = triplesForPath(this.storeOptions, true).values;
    matches.forEach((m) =>
      removeDatasetForSimpleFormValue(m, this.storeOptions)
    );

    if (this.isMultiSelect) {
      if (newSelection.length > 0) {
        newSelection.forEach((concept) => {
          updateSimpleFormValue(this.storeOptions, new NamedNode(concept.uri));
        });
      }
    } else {
      if (newSelection) {
        updateSimpleFormValue(
          this.storeOptions,
          new NamedNode(newSelection.uri)
        );
      }
    }

    this.hasBeenFocused = true;
    super.updateValidations();
  }

  @restartableTask
  *search(value) {
    yield timeout(300);

    return yield this.loadConcepts({
      filter: value,
    });
  }
}

function sortByLabel(concepts = []) {
  return [...concepts].sort((a, b) => {
    return a.label.localeCompare(b.label);
  });
}
