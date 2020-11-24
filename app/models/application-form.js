import Model, {attr, belongsTo} from '@ember-data/model';

export default class ApplicationForm extends Model {
  @attr() uri;
  @attr('datetime', {
    defaultValue(){ return new Date();}
  }) created;

  @attr('datetime', {
    defaultValue(){ return new Date();}
  }) modified;

  @attr('date') aanvraagdatum;
  @attr() canBePaidOnKnownBankAccount;

  @belongsTo('contact-punt') contactinfo; // default needed
  @belongsTo('bank-account') bankAccount; // default needed
  @belongsTo('time-block') timeBlock; // default needed
  @belongsTo('application-form-table') applicationFormTable; // default needed

  @belongsTo('bestuurseenheid') organization;
  @belongsTo('submission-document-status') status;
  @belongsTo('gebruiker') creator;
  @belongsTo('gebruiker') lastModifier;
}
