import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { isBlank } from '@ember/utils';

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

export function isValidPrimaryContact(primaryContactPoint) {
  let requiredFields = ['adres', 'email', 'telefoon'];
  if (primaryContactPoint) {
    requiredFields.forEach((field) => {
      if (
        isBlank(primaryContactPoint[field] && primaryContactPoint.adres.content)
      ) {
        // issue with the email field, the after edition the form isn't validating
        // deleting adres and saving
        // Issue with adres field, when deleting the address on edition
        /* Uncaught Error: Attempted to handle event `becameInvalid` on
        <contact-punt:6310BA4180D2BEF0C9CAACBA> while in state root.loaded.saved. */
        primaryContactPoint.errors.add(field, `${field} is een vereist veld.`);
        return false;
      }
      return true;
    });
  }
  return false;
}
