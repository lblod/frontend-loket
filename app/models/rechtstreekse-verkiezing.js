import Model, { attr, belongsTo } from '@ember-data/model';

export default class RechtstreekseVerkiezingModel extends Model {
  @attr('date') datum;
  @attr('date') geldigheid;
  @belongsTo('bestuursorgaan', { inverse: 'wordtSamengesteldDoor' }) steltSamen;
}
