/**
 * Sets empty strings of given changeset objects to null to avoid saving them in the database
 *
 * @param {Object} changeset Ember changeset
 * @returns Ember changeset
 */
export function setEmptyStringsToNull(changeset) {
  let properties = Object.keys(changeset.toJSON());

  for (const property of properties) {
    if (changeset[property] == '') {
      changeset[property] = null;
    }
  }

  return changeset;
}
