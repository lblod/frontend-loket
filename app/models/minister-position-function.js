import Model, { attr, hasMany } from '@ember-data/model';

export default class MinisterPositionFunctionModel extends Model {
  @attr label;

  @hasMany('organization-status-code', {
    async: true,
    inverse: null,
  })
  applicableStatuses;
}
