import DS from 'ember-data';
import { belongsTo } from 'ember-data/relationships';

export default DS.Model.extend({
  address: DS.attr(),
  cacheResource: belongsTo('file', { inverse: null }),
});
