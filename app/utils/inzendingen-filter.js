import { tracked } from '@glimmer/tracking';

export default class InzendingenFilter {
  @tracked status;
  @tracked besluitTypeIds;
  @tracked modifiedDateFrom;
  @tracked modifiedDateTo;
  @tracked governingBodyIds;

  constructor(params) {
    const keys = Object.keys(params);
    keys.forEach((key) => (this[key] = params[key]));
  }

  get keys() {
    return [
      'status',
      'besluitTypeIds',
      'modifiedDateFrom',
      'modifiedDateTo',
      'governingBodyIds',
    ];
  }

  reset() {
    this.keys.forEach((key) => (this[key] = null));
  }
}
