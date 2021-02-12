
import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class EmployeeDatasetModel extends Model {
  @attr() uri;
  @attr('string') title;
  @attr('string') description;
  @attr('datetime') modified;
  @belongsTo('bestuurseenheid') bestuurseenheid;
  @hasMany('employee-period-slice') periods;
  @hasMany('employee-unit-measure') subjects;
}
