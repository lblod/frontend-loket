import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class MandaatModel extends Model {
  @attr aantalHouders;
  @belongsTo('bestuursfunctie-code', { inverse: null }) bestuursfunctie;
  @hasMany('bestuursorgaan', { inverse: null }) bevatIn;
}
