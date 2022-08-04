import Model, { belongsTo, hasMany } from '@ember-data/model';

export default class RepresentativeBodyModel extends Model {
  @belongsTo('recognized-worship-type') recognizedWorshipType;

  @hasMany('minister-position', { inverse: null }) ministerPosition;
}
