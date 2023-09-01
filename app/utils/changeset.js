import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';

export function createValidatedChangeset(obj, validations) {
  return new Changeset(obj, lookupValidator(validations), validations, {
    skipValidate: true,
  });
}
