import Model, { attr } from '@ember-data/model';

export default class EmployeeUnitMeasureModel extends Model {
  @attr uri;
  @attr label;

  get isFTE() {
    return (
      this.uri ===
      'http://lblod.data.gift/concepts/a97325c1-f572-4dd8-8952-c2cb254f114a'
    );
  }
}
