import { tracked } from '@glimmer/tracking';

export default class InzendingenFilter {
  @tracked status;
  @tracked besluitTypeIds;
  @tracked sessionDateFrom;
  @tracked sessionDateTo;

  constructor(params) {
    const keys = Object.keys(params);
    keys.forEach((key) => (this[key] = params[key]));
  }

  get keys() {
    return ['status', 'besluitTypeIds', 'sessionDateFrom', 'sessionDateTo'];
  }

  reset() {
    this.keys.forEach((key) => (this[key] = null));
  }
}
