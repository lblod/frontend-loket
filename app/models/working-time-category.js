import Model, { attr } from '@ember-data/model';

export default class WorkingTimeCategoryModel extends Model {
  @attr uri;
  @attr label;
}
