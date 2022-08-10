import { attr, belongsTo, hasMany } from '@ember-data/model';
import Post from './post';

// INHERITS FROM POST(positie)
export default class MandaatModel extends Post {
  @attr aantalHouders;
  @belongsTo('bestuursfunctie-code', { inverse: null }) bestuursfunctie;
  @hasMany('bestuursorgaan', { inverse: null }) bevatIn;
}
