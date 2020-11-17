import Model, {attr, belongsTo} from '@ember-data/model';

export default class Subsidy extends Model {
  @attr('number') aangevraagdBedrag;
  @attr('date') aanvraagdatum;
  @attr('boolean') canBePaidOnKnownBankAccount;

  @belongsTo('bestuurseenheid') bestuurseenheid;
  @belongsTo('contact-punt') contactinfo;
  @belongsTo('bank-account') bankAccount;
  @belongsTo('time-block') timeBlock;
}
