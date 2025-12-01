import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task, restartableTask, timeout } from 'ember-concurrency';
import InzendingenFilter from 'frontend-loket/utils/inzendingen-filter';
import { DECISION_TYPE } from 'frontend-loket/models/concept-scheme';
import moment from 'moment';

export default class SupervisionFilterSubmissions extends Component {
  @service store;

  @tracked besluitTypes = [];
  @tracked selectedBesluitTypes = null;
  @tracked filter;

  get fromDate() {
    if (this._fromDate) {
      return this._fromDate;
    }
    try {
      return new Date(Date.parse(this.filter.sessionDateFrom));
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  set fromDate(value) {
    this._fromDate = value;
  }

  get toDate() {
    if (this._toDate) {
      return this._toDate;
    }
    try {
      return new Date(Date.parse(this.filter.sessionDateTo));
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  set toDate(value) {
    this.filter.sessionDateTo = value;
  }

  get isSessionFilterEnabled() {
    return this.filter.sessionDateFrom || this.filter.sessionDateTo;
  }

  get isLoading() {
    return this.besluitTypes.length === 0;
  }

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

  @action
  initRangeFilter() {
    const lastMonth = moment().subtract(1, 'month').startOf('day');
    let initFromValue = lastMonth.toDate().toISOString();

    const today = moment().endOf('day');
    let initToValue = today.toDate().toISOString();

    this.filter.sessionDateFrom = initFromValue;
    this.filter.sessionDateTo = initToValue;
    this.args.onFilterChange(this.filter);
  }

  @action
  updateDate(varName, isoDate) {
    if (varName == 'fromDate') {
      this.filter.sessionDateFrom = isoDate;
      this.args.onFilterChange(this.filter);
    } else {
      this.filter.sessionDateTo = isoDate;
      this.args.onFilterChange(this.filter);
    }
  }

  @action
  resetSessionFilter() {
    this.filter.sessionDateFrom = null;
    this.filter.sessionDateTo = null;
    this.args.onFilterChange(this.filter);
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
