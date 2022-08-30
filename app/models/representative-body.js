import Model, { belongsTo, hasMany } from '@ember-data/model';

export default class RepresentativeBodyModel extends Model {
  @belongsTo('recognized-worship-type', { inverse: null })
  recognizedWorshipType;

  @hasMany('minister-position', { inverse: 'representativeBody' })
  ministerPosition;
}
