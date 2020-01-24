import DS from 'ember-data';

export default DS.Model.extend({
  uri: DS.attr(),
  label: DS.attr('string'),
  dataset: DS.belongsTo('employee-dataset'),
  timePeriod: DS.belongsTo('employee-time-period'),
  observations: DS.hasMany('employee-observation')
});
