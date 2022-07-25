import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export const CONTACT_TYPE = {
  PRIMARY: 'Primary',
  SECONDARY: 'Secondary',
};

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

  @belongsTo('contact-punt', { inverse: null })
  secondaryContactPoint;

  // @hasMany('agent-in-position', { inverse: 'contactPoints' }) agentsInPosition;
  @hasMany('mandataris') mandatarissen;
}

export function findPrimaryContactPoint(contactList) {
  return contactList.findBy('type', CONTACT_TYPE.PRIMARY);
}

export function findSecondaryContactPoint(contactList) {
  return contactList.findBy('type', CONTACT_TYPE.SECONDARY);
}
