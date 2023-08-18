import Model, { attr, belongsTo } from '@ember-data/model';

export default class MinisterConditionModel extends Model {
  @attr satisfied;

  @belongsTo('minister-condition-criterion', {
    async: true,
    inverse: null,
  })
  criterion;

  @belongsTo('document-type-criterion', {
    async: true,
    inverse: null,
  })
  documentTypeCriterion;
}
