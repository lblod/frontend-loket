import DS from 'ember-data';

export default DS.Model.extend({
  created: DS.attr('datetime'),
  modified: DS.attr('datetime'),
  description: DS.attr('string'),
  remark: DS.attr('string'),
  temporalCoverage: DS.attr('string'),
  businessIdentifier: DS.attr('string'),
  businessName: DS.attr('string'),
  nomenclature: DS.attr('string'),
  dateOfEntryIntoForce: DS.attr('date'),
  enddate: DS.attr('date'),
  isModification: DS.attr('boolean'),
  hasExtraTaxRates: DS.attr('boolean'),
  agendaItemCount: DS.attr('integer'),
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
