/* eslint-disable ember/no-get */
import { get } from '@ember/object';

export default function hasHarvestMeta(record) {
  if (!record) {
    return false;
  }

  return (
    get(record, 'vendor') ||
    get(record, 'harvestSource') ||
    get(record, 'harvestOriginalUri') ||
    get(record, 'harvestDate') ||
    get(record, 'harvestJob') ||
    get(record, 'harvestLink')
  );
}
