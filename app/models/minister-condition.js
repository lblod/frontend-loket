import Model, { attr, belongsTo } from '@ember-data/model';

export default class MinisterConditionModel extends Model {
  @attr() satisfied;

  @belongsTo('minister-condition-criterion') criterion;
  @belongsTo('document-type-criterion') documentTypeCriterion;
}
