import Model, { attr } from '@ember-data/model';

export default class GeslachtCodeModel extends Model {
  @attr uri;
  @attr label;

  get isMale() {
    return this.id === '5ab0e9b8a3b2ca7c5e000028';
  }
}
