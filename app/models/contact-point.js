import Model, { attr, belongsTo } from '@ember-data/model';

export const CONTACT_TYPE = {
  PRIMARY: 'Primary',
  SECONDARY: 'Secondary',
};

export default class ContactPointModel extends Model {
  @attr email;
  @attr telephone;
  @attr fax;
  @attr website;
  @attr type;

  @belongsTo('address', {
    inverse: null,
  })
  contactAddress;
}

export function createPrimaryContact(store) {
  let record = store.createRecord('contact-point');
  record.type = CONTACT_TYPE.PRIMARY; // Workaround for: https://github.com/emberjs/ember-inspector/issues/1898

  return record;
}

export function createSecondaryContact(store) {
  let record = store.createRecord('contact-point');
  record.type = CONTACT_TYPE.SECONDARY; // Workaround for: https://github.com/emberjs/ember-inspector/issues/1898

  return record;
}

export function findPrimaryContact(contactList) {
  return contactList.findBy('type', CONTACT_TYPE.PRIMARY);
}

export function findSecondaryContact(contactList) {
  return contactList.findBy('type', CONTACT_TYPE.SECONDARY);
}
