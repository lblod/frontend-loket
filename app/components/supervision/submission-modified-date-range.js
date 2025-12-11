import Component from '@glimmer/component';
import moment from 'moment';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class SupervisionSubmissionModifiedDateRange extends Component {
  @tracked modifiedDate = {};

  get fromDate() {
    if (this._fromDate) {
      return this._fromDate;
    }
    try {
      return new Date(Date.parse(this.args.modifiedDateFrom));
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
      return new Date(Date.parse(this.args.modifiedDateTo));
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  set toDate(value) {
    this.modifiedDate.to = value;
  }

  get isModifiedFilterEnabled() {
    return this.args.modifiedDateFrom || this.args.modifiedDateTo;
  }

  @action
  initRangeFilter() {
    const lastMonth = moment().subtract(1, 'month').startOf('day');
    let initFromValue = lastMonth.toDate().toISOString();

    const today = moment().endOf('day');
    let initToValue = today.toDate().toISOString();

    this.modifiedDate.from = initFromValue;
    this.modifiedDate.to = initToValue;
    this.args.onChange(this.modifiedDate);
  }

  @action
  updateDate(varName, isoDate) {
    if (varName == 'fromDate') {
      this.modifiedDate.from = isoDate;
      this.args.onChange(this.modifiedDate);
    } else {
      this.modifiedDate.to = isoDate;
      this.args.onChange(this.modifiedDate);
    }
  }

  @action
  resetModifiedFilter() {
    this.modifiedDate = {};
    this.args.onChange(this.modifiedDate);
  }
}
