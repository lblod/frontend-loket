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

  @belongsTo('adres', {
    async: true,
    inverse: null,
  })
  adres;

  @belongsTo('contact-punt', {
    async: true,
    inverse: null,
  })
  secondaryContactPoint;

  @hasMany('agent-in-position', {
    async: true,
    inverse: 'contacts',
    polymorphic: true,
    as: 'contact-punt',
  })
  agentsInPosition;

  @hasMany('mandataris', {
    async: true,
    inverse: 'contactPoints',
    polymorphic: true,
    as: 'contact-punt',
  })
  mandatarissen;
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
  return findByType(contactList, CONTACT_TYPE.PRIMARY);
}

export function findSecondaryContactPoint(contactList) {
  return findByType(contactList, CONTACT_TYPE.SECONDARY);
}

function findByType(contactList, type) {
  return contactList.find((contact) => contact.type === type);
}

export async function isValidPrimaryContact(primaryContactPoint) {
  let requiredFields = ['email', 'telefoon'];

  requiredFields.forEach((field) => {
    let value = primaryContactPoint[field];

    if (!(typeof value === 'string' && value.trim().length > 0)) {
      primaryContactPoint.errors.add(field, `${field} is een vereist veld.`);
    }
  });

  let adres = await primaryContactPoint.adres;
  if (!adres) {
    // TODO: This works around a problem in Ember Data where adding an error without the record being in a dirty state triggers an exception.
    // Ember Data doesn't consider relationship changes a "dirty" change, so this causes issues if the adres is cleared.
    // This workaround uses `.send` but that is a private API which is no longer present in Ember Data 4.x
    // The bug is fixed in Ember Data 4.6 so we need to update to that version instead of 4.4 LTS
    // More information in the Discord: https://discord.com/channels/480462759797063690/1016327513900847134
    // Same old issue where they use this workaround: https://stackoverflow.com/questions/27698496/attempted-to-handle-event-becameinvalid-while-in-state-root-loaded-saved
    primaryContactPoint.send?.('becomeDirty');
    primaryContactPoint.errors.add('adres', 'adres is een vereist veld.');
  }

  return primaryContactPoint.isValid;
}
