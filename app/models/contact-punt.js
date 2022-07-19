import Model, { attr, belongsTo } from '@ember-data/model';

export default class ContactPuntModel extends Model {
  @attr uri;
  @attr type;
  @attr aanschrijfprefix;
  @attr email;
  @attr fax;
  @attr naam;
  @attr voornaam;
  @attr achternaam;
  @attr website;
  @attr telefoon;
  @belongsTo('adres', { inverse: null }) adres;
  @belongsTo('mandataris', { inverse: 'contactPoints' }) mandataris;
}
