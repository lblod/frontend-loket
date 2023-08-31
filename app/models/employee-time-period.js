import Model, { attr, hasMany } from '@ember-data/model';

export default class EmployeeTimePeriodModel extends Model {
  @attr uri;
  @attr label;
  @attr('datetime') start;

  @hasMany('employee-period-slice', {
    async: true,
    inverse: 'timePeriod',
  })
  slices;
}
