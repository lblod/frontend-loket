import DS from 'ember-data';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default DS.Model.extend({
  key: attr(),
  value: attr(),
  matchKind: attr(),
  formNode: belongsTo('form-node')
});
