import { tracked } from '@glimmer/tracking';

export default class InzendingenFilter {
  @tracked status;
  @tracked besluitTypeIds;

  constructor(params) {
    const keys = Object.keys(params);
    keys.forEach((key) => (this[key] = params[key]));
  }

  get keys() {
    return ['status', 'besluitTypeIds'];
  }

  reset() {
    this.keys.forEach((key) => (this[key] = null));
  }
}
