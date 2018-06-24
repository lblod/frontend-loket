import Model from 'ember-data/model';
import { collect } from '@ember/object/computed';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  // A string representation of this model, based on its attributes.
  // This is what mu-cl-resources uses to search on, and how the model will be presented while editing relationships.
  stringRep: collect.apply(this,['id', 'created', 'modified', 'sentDate', 'description', 'remark', 'temporalCoverage', 'businessIdentifier', 'businessName', 'dateOfEntryIntoForce', 'endDate', 'hasExtraTaxRates', 'agendaItemCount', 'sessionDate', 'title', 'administrationType', 'administrationName', 'decisionDateOtherAdministration', 'decisionSummary', 'dateHandover', 'text']),

  created: attr('datetime'),
  modified: attr('datetime'),
  sentDate: attr('datetime'),
  description: attr(),
  remark: attr(),
  temporalCoverage: attr(),
  businessIdentifier: attr(),
  businessName: attr(),
  dateOfEntryIntoForce: attr('date'),
  endDate: attr('date'),
  hasExtraTaxRates: attr(),
  agendaItemCount: attr(),
  sessionDate: attr('datetime'),
  title: attr(),
  administrationType: attr(),
  administrationName: attr(),
  decisionDateOtherAdministration: attr('date'),
  decisionSummary: attr(),
  dateHandover: attr('date'),
  text: attr(),
  status: belongsTo('document-status', { inverse: null }),
  lastModifier: belongsTo('gebruiker', { inverse: null }),
  bestuurseenheid: belongsTo('bestuurseenheid', { inverse: null }),
  formSolution: belongsTo('form-solution', { inverse: 'inzendingVoorToezicht' }),
  inzendingType: belongsTo('toezicht-inzending-type', { inverse: null }),
  besluitType: belongsTo('besluit-type', { inverse: null }),
  bestuursorgaan: belongsTo('bestuursorgaan', { inverse: null }),
  authenticityType: belongsTo('toezicht-document-authenticity-type', { inverse: null }),
  accountAcceptanceStatus: belongsTo('toezicht-account-acceptance-status', { inverse: null }),
  deliveryReportType: belongsTo('toezicht-delivery-report-type', { inverse: null }),
  fiscalPeriod: belongsTo('toezicht-fiscal-period', { inverse: null }),
  nomenclature: belongsTo('toezicht-nomenclature', { inverse: null }),
  taxType: belongsTo('toezicht-tax-type', { inverse: null }),
  files: hasMany('file', { inverse: null }),
  taxRates: hasMany('tax-rate', { inverse: null })
});
