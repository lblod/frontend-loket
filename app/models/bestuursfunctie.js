import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class BestuursfunctieModel extends Model {
  @attr uri;

  @belongsTo('bestuursfunctie-code', {
    async: true,
    inverse: null,
  })
  rol;

  @belongsTo('contact-punt', {
    async: true,
    inverse: null,
  })
  contactinfo;

  @hasMany('bestuursorgaan', {
    async: true,
    inverse: null,
  })
  bevatIn;
}
