import Model, { attr } from '@ember-data/model';

export default class BankAccount extends Model {
  @attr bankAcountNumber;
}
