import Model, { belongsTo, hasMany } from '@ember-data/model';

export default class RepresentativeBodyModel extends Model {
  @belongsTo('recognized-worship-type', {
    async: true,
    inverse: null,
  })
  recognizedWorshipType;

  @hasMany('minister-position', {
    async: true,
    inverse: 'representativeBody',
  })
  ministerPosition;
}
