import Model, { attr, hasMany } from '@warp-drive/legacy/model';

export default class GebruikerModel extends Model {
  @attr voornaam;
  @attr achternaam;
  @attr rijksregisterNummer;

  @hasMany('account', { async: false, inverse: 'gebruiker' }) account;

  @hasMany('bestuurseenheid', {
    async: false,
    inverse: null,
    polymorphic: true,
  })
  bestuurseenheden;

  get group() {
    return this.bestuurseenheden.at(0);
  }

  // used for mock login
  get fullName() {
    return `${this.voornaam} ${this.achternaam}`.trim();
  }
}
