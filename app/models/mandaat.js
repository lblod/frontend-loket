import { attr, belongsTo, hasMany } from '@ember-data/model';
import Post from './post';

// INHERITS FROM POST(positie)
export default class MandaatModel extends Post {
  @attr uri;
  @attr aantalHouders;

  @belongsTo('bestuursfunctie-code', {
    async: true,
    inverse: null,
  })
  bestuursfunctie;

  @hasMany('bestuursorgaan', {
    async: true,
    inverse: 'bevat',
  })
  bevatIn;
}
