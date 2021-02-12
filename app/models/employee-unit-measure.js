import Model, { attr } from '@ember-data/model';
import { equal } from '@ember/object/computed';

export default class EmployeeUnitMeasureModel extends Model {
  @attr() uri;
  @attr('string') label;
  @equal('uri', 'http://lblod.data.gift/concepts/a97325c1-f572-4dd8-8952-c2cb254f114a') isFTE;
}

