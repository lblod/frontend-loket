import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  aantalHouders: attr(),
  bestuursfunctie: belongsTo('bestuursfunctie-code', { inverse: null }),
  bevatIn: belongsTo('bestuursorgaan', { inverse: 'bevat' })
});
