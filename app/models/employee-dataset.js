import DS from 'ember-data';

export default DS.Model.extend({
  uri: DS.attr(),
  title: DS.attr('string'),
  description: DS.attr('string'),
  modified: DS.attr('datetime'),
  bestuurseenheid: DS.belongsTo('bestuurseenheid'),
  periods: DS.hasMany('employee-period-slice'),
  subjects: DS.hasMany('employee-unit-measure')
});
