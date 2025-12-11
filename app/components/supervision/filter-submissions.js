import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import InzendingenFilter from 'frontend-loket/utils/inzendingen-filter';

export default class SupervisionFilterSubmissions extends Component {
  @service store;

  @tracked filter;

  constructor() {
    super(...arguments);
    this.filter = new InzendingenFilter(this.args.filter);
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
  handleModifiedDateRangeFilterChange(modifiedDate) {
    this.filter.modifiedDateFrom = modifiedDate.from;
    this.filter.modifiedDateTo = modifiedDate.to;
    this.args.onFilterChange(this.filter);
  }

  @action
  resetFilters() {
    this.filter.reset();
    this.args.onFilterChange(this.filter);
  }
}
