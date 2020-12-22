import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class FractieModel extends Model {
  @attr() naam;
  @belongsTo('fractietype', { inverse: null }) fractietype;
  @hasMany('bestuursorgaan', { inverse: null }) bestuursorganenInTijd;
  @belongsTo('bestuurseenheid', { inverse: null }) bestuurseenheid;
}
