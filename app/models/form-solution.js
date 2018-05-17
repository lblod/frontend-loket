import DS from 'ember-data';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default DS.Model.extend({
  hasOwner: attr(),
  inzendingVoorToezicht: belongsTo('inzending-voor-toezicht'),
  formNode: belongsTo('form-node')
});
