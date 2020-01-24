import DS from 'ember-data';

export default DS.Model.extend({
  uri: DS.attr(),
  label: DS.attr('string'),
  start: DS.attr('datetime'),
  slices: DS.hasMany('employee-period-slice')
});
