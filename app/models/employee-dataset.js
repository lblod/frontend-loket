import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class EmployeeDatasetModel extends Model {
  @attr uri;
  @attr title;
  @attr description;
  @attr('datetime') modified;

  @belongsTo('bestuurseenheid', {
    async: true,
    inverse: null,
  })
  bestuurseenheid;

  @hasMany('employee-period-slice', {
    async: true,
    inverse: 'dataset',
  })
  periods;

  @hasMany('employee-unit-measure', {
    async: true,
    inverse: null,
  })
  subjects;
}
