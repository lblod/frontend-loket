/* eslint-disable ember/no-get, ember/classic-decorator-no-classic-methods */
import Model, { attr, hasMany } from '@ember-data/model';

export default class GebruikerModel extends Model {
  @attr voornaam;
  @attr achternaam;
  @attr rijksregisterNummer;
  @hasMany('account', { inverse: null }) account;
  @hasMany('bestuurseenheid') bestuurseenheden;

  get group() {
    return this.get('bestuurseenheden.firstObject');
  }

  // used for mock login
  get fullName() {
    return `${this.voornaam} ${this.achternaam}`.trim();
  }
}
