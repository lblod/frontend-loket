import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class EmployeePeriodSliceModel extends Model {
  @attr uri;
  @attr label;

  @belongsTo('employee-dataset', {
    async: true,
    inverse: 'periods',
  })
  dataset;

  @belongsTo('employee-time-period', {
    async: true,
    inverse: 'slices',
  })
  timePeriod;

  @hasMany('employee-observation', {
    async: true,
    inverse: 'slice',
  })
  observations;
}
