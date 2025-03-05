import Model from '@ember-data/model';

/**
 * A simple helper that returns the value of an async belongsTo relationship in a sync way.
 * The helper assumes the data is already loaded.
 * @param {Model} record
 * @param {string} relationshipName
 * @returns unknown
 */
export default function belongsTo(record, relationshipName) {
  if (record instanceof Model) {
    return record.belongsTo(relationshipName).value();
  }
}
