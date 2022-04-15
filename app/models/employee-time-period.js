import Model, { attr, hasMany } from '@ember-data/model';

export default class EmployeeTimePeriodModel extends Model {
  @attr() uri;
  @attr('string') label;
  @attr('datetime') start;
  @hasMany('employee-period-slice') slices;
}
