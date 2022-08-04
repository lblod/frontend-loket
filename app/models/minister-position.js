import Model, { belongsTo, hasMany } from '@ember-data/model';

export default class MinisterPositionModel extends Model {
  @belongsTo('minister-position-function') function;
  @belongsTo('worship-administrative-unit', { inverse: null })
  worshipService;
  @belongsTo('representative-body') representationBody;

  @hasMany('minister', { inverse: null }) heldByMinisters;
}
