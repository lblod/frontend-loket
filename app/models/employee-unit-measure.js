import DS from 'ember-data';
import { equal } from '@ember/object/computed';

export default DS.Model.extend({
  uri: DS.attr(),
  label: DS.attr('string'),

  isFTE: equal('uri', 'http://lblod.data.gift/concepts/a97325c1-f572-4dd8-8952-c2cb254f114a')
});
