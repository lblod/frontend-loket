import DS from 'ember-data';

export default DS.Model.extend({
  created: DS.attr('datetime'),
  modified: DS.attr('datetime'),
  status: DS.belongsTo('document-status'),
  bestuurseenheid: DS.belongsTo('bestuurseenheid'),
  attachment: DS.belongsTo('file'),
  lastModifiedBy: DS.belongsTo('gebruiker'),
  documentType: DS.belongsTo('document-type'),
  omschrijving: DS.attr('string'),
  besluitType: DS.belongsTo('besluit-type'),
  decidedBy: DS.belongsTo('bestuursorgaan'),
  datumZitting: DS.attr('date'),
  opmerking: DS.attr('string'),
  boekjaar: DS.attr('string'),
  ondernemingsnummer: DS.attr('string'),
  ondernemingsnaam: DS.attr('string'),
  nomenclatuur: DS.attr('string'),
  datumInwerkingtreding: DS.attr('date'),
  einddatum: DS.attr('date'),
  isWijziging: DS.attr('boolean'),
  overigeAanslagvoeten: DS.attr('boolean'),
  aantalAgendaPunten: DS.attr('number')
});
