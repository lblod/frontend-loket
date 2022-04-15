import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class EmployeePeriodSliceModel extends Model {
  @attr() uri;
  @attr('string') label;
  @belongsTo('employee-dataset') dataset;
  @belongsTo('employee-time-period') timePeriod;
  @hasMany('employee-observation') observations;
}
