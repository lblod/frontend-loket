import Model, { belongsTo, hasMany } from '@ember-data/model';

export default class WorshipAdministrativeUnitModel extends Model {
  @belongsTo('recognized-worship-type') recognizedWorshipType;

  @hasMany('minister-position', { inverse: null }) ministerPositions;
}
