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

  // TODO faze out
  // @belongsTo('contact-punt') contactinfo; // default needed
  // @belongsTo('bank-account') bankAccount; // default needed
  // @belongsTo('time-block') timeBlock; // concept

  @belongsTo('subsidy-application-flow-step') subsidyApplicationFlowStep;

  @belongsTo('subsidy-measure-consumption') subsidyMeasureConsumption;

  @belongsTo('gebruiker') creator;

  @belongsTo('gebruiker') lastModifier;

  // TODO could this be defined as a concept
  @belongsTo('submission-document-status') status;

  @hasMany('file') sources;

  @hasMany('bestuurseenheid') organization;
}
