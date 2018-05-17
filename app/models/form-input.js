import DS from 'ember-data';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default DS.Model.extend({
  index: attr(),
  label: attr(),
  displayType: attr(),
  options: attr('json'),
  identifier: attr(),
  parent: belongsTo('form-node'),
  dynamicSubforms: hasMany('dynamic-subform')
});
