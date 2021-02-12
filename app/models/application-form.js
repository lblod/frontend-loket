import Model, { attr, belongsTo } from '@ember-data/model';

export default class ApplicationForm extends Model {
  @attr() uri;
  @attr('datetime', {
    defaultValue(){ return new Date();}
  }) created;

  @attr('datetime', {
    defaultValue(){ return new Date();}
  }) modified;

  @belongsTo('contact-punt') contactinfo; // default needed
  @belongsTo('bank-account') bankAccount; // default needed
  @belongsTo('time-block') timeBlock; // concept
  @belongsTo('subsidiemaatregel-aanbod') subsidyMeasure; // concept

  @belongsTo('bestuurseenheid') organization;
  @belongsTo('submission-document-status') status;
  @belongsTo('gebruiker') creator;
  @belongsTo('gebruiker') lastModifier;
}
