import DS from 'ember-data';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default DS.Model.extend({
  uri: attr(),
  start: attr('date'),
  end: attr('date'),
  description: attr('string'),
  formNode: belongsTo('form-node')
});
