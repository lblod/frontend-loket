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

  @hasMany('agent-in-position', { inverse: 'contacts' }) agentsInPosition;
  @hasMany('mandataris', { inverse: 'contactPoints' }) mandatarissen;
}

export function createPrimaryContactPoint(store) {
  let record = store.createRecord('contact-punt');
  record.type = CONTACT_TYPE.PRIMARY; // Workaround for: https://github.com/emberjs/ember-inspector/issues/1898

  return record;
}

export function createSecondaryContactPoint(store) {
  let record = store.createRecord('contact-punt');
  record.type = CONTACT_TYPE.SECONDARY; // Workaround for: https://github.com/emberjs/ember-inspector/issues/1898

  return record;
}

export function findPrimaryContactPoint(contactList) {
  return contactList.findBy('type', CONTACT_TYPE.PRIMARY);
}

export function findSecondaryContactPoint(contactList) {
  return contactList.findBy('type', CONTACT_TYPE.SECONDARY);
}
