import DS from 'ember-data';
import { belongsTo } from 'ember-data/relationships';

export default DS.Model.extend({
  address: DS.attr(),
  replicatedFile: belongsTo('file', { inverse: null })
});
