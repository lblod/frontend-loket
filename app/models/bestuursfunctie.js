import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class BestuursfunctieModel extends Model {
  @attr uri;
  @belongsTo('bestuursfunctie-code', { inverse: null }) rol;
  @belongsTo('contact-punt', { inverse: null }) contactinfo;
  @hasMany('bestuursorgaan', { inverse: null }) bevatIn;
}
