import Model, { hasMany, belongsTo } from '@ember-data/model';

export default class MinisterModel extends Model {
  @belongsTo('minister-position') position;
  @belongsTo('financing-code') financing;

  @hasMany('minister-condition') conditions;
}
