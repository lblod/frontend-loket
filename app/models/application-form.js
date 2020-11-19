import Model, {attr, belongsTo} from '@ember-data/model';

export default class Subsidy extends Model {
  @attr('datetime', {
    defaultValue(){ return new Date();}
  }) created;

  @attr('datetime', {
    defaultValue(){ return new Date();}
  }) modified;

  @attr('number') aangevraagdBedrag;
  @attr('date') aanvraagdatum;
  @attr('boolean') canBePaidOnKnownBankAccount;

  @belongsTo('bestuurseenheid') organization;
  @belongsTo('contact-punt') contactinfo;
  @belongsTo('bank-account') bankAccount;
  @belongsTo('time-block') timeBlock;

  @belongsTo('submission-document-status') status;
  @belongsTo('gebruiker') creator;
  @belongsTo('gebruiker') lastModifier;
}
