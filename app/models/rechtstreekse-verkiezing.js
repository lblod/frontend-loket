import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  datum: attr('date'),
  geldigheid: attr('date'),
  steltSamen: belongsTo('bestuursorgaan', { inverse: null })
});
