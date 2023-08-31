import Model, { attr, belongsTo } from '@ember-data/model';

export default class EmployeeObservationModel extends Model {
  @attr uri;
  @attr value;

  @belongsTo('employee-unit-measure', {
    async: true,
    inverse: null,
  })
  unitMeasure;

  @belongsTo('educational-level', {
    async: true,
    inverse: null,
  })
  educationalLevel;

  @belongsTo('geslacht-code', {
    async: true,
    inverse: null,
  })
  sex;

  @belongsTo('working-time-category', {
    async: true,
    inverse: null,
  })
  workingTimeCategory;

  @belongsTo('employee-legal-status', {
    async: true,
    inverse: null,
  })
  legalStatus;

  @belongsTo('employee-period-slice', {
    async: true,
    inverse: 'observations',
  })
  slice;
}
