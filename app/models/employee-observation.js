import Model, { attr, belongsTo } from '@ember-data/model';

export default class EmployeeObservationModel extends Model {
  @attr uri;
  @attr('number') value;
  @belongsTo('employee-unit-measure') unitMeasure;
  @belongsTo('educational-level') educationalLevel;
  @belongsTo('geslacht-code') sex;
  @belongsTo('working-time-category') workingTimeCategory;
  @belongsTo('employee-legal-status') legalStatus;
  @belongsTo('employee-period-slice') slice;
}
