import Model, { attr } from '@ember-data/model';

export default class EmployeeLegalStatusModel extends Model {
  @attr uri;
  @attr label;
}
