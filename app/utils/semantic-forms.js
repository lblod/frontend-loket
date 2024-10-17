import { validationsForFieldWithType } from '@lblod/submission-form-helpers';

/**
 * Determines if the form field has the required validator attached to it.
 * @param {string} fieldUri
 * @param {ForkingStore} store
 * @param {NamedNode} formGraph
 * @returns {boolean}
 */
export function isRequiredField(fieldUri, store, formGraph) {
  const constraints = validationsForFieldWithType(fieldUri, {
    store,
    formGraph,
  });
  return constraints.some(
    (constraint) =>
      constraint.type.value ===
      'http://lblod.data.gift/vocabularies/forms/RequiredConstraint',
  );
}
