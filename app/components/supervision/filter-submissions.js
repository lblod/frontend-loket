import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import InzendingenFilter from 'frontend-loket/utils/inzendingen-filter';
import moment from 'moment';

export default class SupervisionFilterSubmissions extends Component {
  @service store;

  @tracked filter;

  get fromDate() {
    if (this._fromDate) {
      return this._fromDate;
    }
    try {
      return new Date(Date.parse(this.filter.modifiedDateFrom));
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
      return new Date(Date.parse(this.filter.modifiedDateTo));
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  set toDate(value) {
    this.filter.modifiedDateTo = value;
  }

  get isModifiedFilterEnabled() {
    return this.filter.modifiedDateFrom || this.filter.modifiedDateTo;
  }

  constructor() {
    super(...arguments);
    this.filter = new InzendingenFilter(this.args.filter);
  }

  @action
  initRangeFilter() {
    const lastMonth = moment().subtract(1, 'month').startOf('day');
    let initFromValue = lastMonth.toDate().toISOString();

    const today = moment().endOf('day');
    let initToValue = today.toDate().toISOString();

    this.filter.modifiedDateFrom = initFromValue;
    this.filter.modifiedDateTo = initToValue;
    this.args.onFilterChange(this.filter);
  }

  @action
  updateDate(varName, isoDate) {
    if (varName == 'fromDate') {
      this.filter.modifiedDateFrom = isoDate;
      this.args.onFilterChange(this.filter);
    } else {
      this.filter.modifiedDateTo = isoDate;
      this.args.onFilterChange(this.filter);
    }
  }

  @action
  resetModifiedFilter() {
    this.filter.modifiedDateFrom = null;
    this.filter.modifiedDateTo = null;
    this.args.onFilterChange(this.filter);
  }

  @action
  handleStatusFilterChange(statusUri) {
    this.filter.status = statusUri;
    this.args.onFilterChange(this.filter);
  }

  @action
  handleBesluitTypeFilterChange(besluitTypeIds) {
    this.filter.besluitTypeIds = besluitTypeIds;
    this.args.onFilterChange(this.filter);
  }

  @action
  resetFilters() {
    this.filter.reset();
    this.args.onFilterChange(this.filter);
  }
}
