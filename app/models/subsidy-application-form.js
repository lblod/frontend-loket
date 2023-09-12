import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class SubsidyApplicationForm extends Model {
  @attr uri;

  @attr('datetime', {
    defaultValue() {
      return new Date();
    },
  })
  created;

  @attr('datetime', {
    defaultValue() {
      return new Date();
    },
  })
  modified;

  @attr projectName;

  @belongsTo('subsidy-application-flow-step', {
    async: true,
    inverse: null,
  })
  subsidyApplicationFlowStep;

  @belongsTo('subsidy-measure-consumption', {
    async: true,
    inverse: 'subsidyApplicationForms',
  })
  subsidyMeasureConsumption;

  @belongsTo('gebruiker', {
    async: true,
    inverse: null,
  })
  creator;

  @belongsTo('gebruiker', {
    async: true,
    inverse: null,
  })
  lastModifier;

  // TODO could this be defined as a concept
  @belongsTo('submission-document-status', {
    async: true,
    inverse: null,
  })
  status;

  @hasMany('file', {
    async: false,
    inverse: null,
  })
  sources;

  @hasMany('bestuurseenheid', {
    async: true,
    inverse: null,
  })
  organization;
}
