import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { compare } from '@ember/utils';
import { keepLatestTask } from 'ember-concurrency';

export default class ConceptSchemeFilter extends Component {
  @service store;

  @tracked concepts = [];

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  get selectedIds() {
    return this.args.selected.map((concept) => concept.id);
  }

  @keepLatestTask
  *loadData() {
    const concepts = yield this.store.queryAll('concept', {
      sort: 'label',
      'filter[top-concept-schemes][:uri:]': this.args.conceptScheme,
    });
    // Additional sorting in frontend since mu-cl-resources doesn't
    // sort language-tagged strings correctly
    this.concepts = concepts
      .toArray()
      .sort((a, b) => compare(a.label, b.label));
  }

  @action
  updateSelection(selectedIds) {
    const records = this.concepts.filter((record) =>
      selectedIds.includes(record.id),
    );
    this.args.onChange(records);
  }
}
