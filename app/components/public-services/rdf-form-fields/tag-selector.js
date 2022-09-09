import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import {
  triplesForPath,
  updateSimpleFormValue,
  removeDatasetForSimpleFormValue,
} from '@lblod/submission-form-helpers';
import { Literal } from 'rdflib';

export default class TagSelectorComponent extends InputFieldComponent {
  @tracked selectedTags = [];
  id = `tag-selector-${guidFor(this)}`;

  constructor() {
    super(...arguments);

    this.loadPersistedTags();
  }

  get hasTags() {
    return this.selectedTags.length > 0;
  }

  @action
  handleTagSelection(newTagSelection) {
    this.selectedTags = newTagSelection;

    this.updateStore(this.selectedTags);
  }

  @action
  createTag(newTag) {
    this.selectedTags = [
      ...this.selectedTags,
      new Literal(newTag.trim(), this.args.field.language),
    ];
    this.updateStore(this.selectedTags);
  }

  @action
  buildSuggestion(term) {
    return `Voeg "${term.trim()}" toe`;
  }

  @action
  showCreateWhen(term) {
    if (term.trim().length === 0) {
      return false;
    }

    let tagAlreadyExists = this.selectedTags.some(
      (tagLiteral) => tagLiteral.value === term.trim()
    );

    return !tagAlreadyExists;
  }

  loadPersistedTags() {
    this.selectedTags = triplesForPath(this.storeOptions).values;
  }

  updateStore(newSelection) {
    // Cleanup old value(s) in the store
    const matches = triplesForPath(this.storeOptions, true).values;
    matches.forEach((m) =>
      removeDatasetForSimpleFormValue(m, this.storeOptions)
    );

    if (newSelection.length > 0) {
      newSelection.forEach((tagLiteral) => {
        updateSimpleFormValue(this.storeOptions, tagLiteral);
      });
    }

    this.hasBeenFocused = true;
    super.updateValidations();
  }
}
