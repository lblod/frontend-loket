import DS from 'ember-data';

export default DS.Model.extend({
  uri: DS.attr(),
  value: DS.attr('number'),
  unitMeasure: DS.belongsTo('employee-unit-measure'),
  educationalLevel: DS.belongsTo('educational-level'),
  sex: DS.belongsTo('geslacht-code'),
  workingTimeCategory: DS.belongsTo('working-time-category'),
  legalStatus: DS.belongsTo('employee-legal-status'),
  slice: DS.belongsTo('employee-period-slice')
});
