import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task, restartableTask, timeout } from 'ember-concurrency';
import InzendingenFilter from 'frontend-loket/utils/inzendingen-filter';
import { DECISION_TYPE } from 'frontend-loket/models/concept-scheme';

export default class SupervisionFilterSubmissions extends Component {
  @service store;

  @tracked besluitTypes = [];
  @tracked selectedBesluitTypes = null;
  @tracked filter;

  constructor() {
    super(...arguments);
    this.filter = new InzendingenFilter(this.args.filter);
    this.loadData.perform();
  }

  @task
  *loadData() {
    this.besluitTypes = yield this.store.query('concept', {
      filter: {
        'concept-schemes': {
          ':uri:': DECISION_TYPE,
        },
      },
      sort: 'label',
      page: { size: 100 },
    });
    this.besluitTypes = this.besluitTypes.slice();

    this.updateSelectedValue();
  }

  get isLoading() {
    return this.besluitTypes.length === 0;
  }

  @restartableTask
  *search(term) {
    yield timeout(600);
    let results = yield this.store.query('concept', {
      filter: {
        label: term,
        'concept-schemes': {
          ':uri:': DECISION_TYPE,
        },
      },
      sort: 'label',
      page: { size: 100 },
    });

    return results.slice();
  }

  @action handleStatusFilterChange(statusUri) {
    this.status = statusUri;
    this.filter.status = statusUri;
    this.args.onFilterChange(this.filter);
  }

  @action
  async updateSelectedValue() {
    if (this.filter.besluitTypeIds && !this.selectedBesluitTypes) {
      let selected = await this.store.query('concept', {
        filter: {
          id: this.filter.besluitTypeIds,
          'concept-schemes': {
            ':uri:': DECISION_TYPE,
          },
        },
        page: { size: this.filter.besluitTypeIds.split(',').length },
      });
      this.selectedBesluitTypes = selected.slice();
    } else if (!this.filter.besluitTypeIds) {
      this.selectedBesluitTypes = null;
    }
  }

  @action
  changeSelectedBesluitTypes(selectedTypes) {
    this.selectedBesluitTypes = selectedTypes;
    this.filter.besluitTypeIds =
      selectedTypes && selectedTypes.map((type) => type.id).join(',');

    this.args.onFilterChange(this.filter);
  }

  @action
  resetFilters() {
    this.filter.reset();
    this.updateSelectedValue();
    this.args.onFilterChange(this.filter);
  }
}
