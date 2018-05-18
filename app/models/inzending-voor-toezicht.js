import DS from 'ember-data';

export default DS.Model.extend({
  created: DS.attr('datetime'),
  modified: DS.attr('datetime'),
  description: DS.attr('string'),
  remark: DS.attr('string'),
  temporalcoverage: DS.attr('string'),
  businessidentifier: DS.attr('string'),
  businessname: DS.attr('string'),
  nomenclature: DS.attr('string'),
  dateofentryintoforce: DS.attr('date'),
  enddate: DS.attr('date'),
  ismodification: DS.attr('boolean'),
  hasextrataxrates: DS.attr('boolean'),
  agendaitemcount: DS.attr('integer'),
  status: DS.belongsTo('document-status'),
  lastModifier: DS.belongsTo('gebruiker'),
  bestuurseenheid: DS.belongsTo('bestuurseenheid'),
  formSolution: DS.belongsTo('form-solution'),
  inzendingType: DS.belongsTo('toezicht-inzending-type'),
  besluitType: DS.belongsTo('besluit-type'),
  bestuursorgaan: DS.belongsTo('bestuursorgaan'),
  files: DS.hasMany('file'),
  taxRates: DS.hasMany('tax-rate')
});
