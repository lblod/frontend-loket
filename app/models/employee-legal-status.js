import Model, { attr } from '@warp-drive/legacy/model';

export default class EmployeeLegalStatusModel extends Model {
  @attr uri;
  @attr label;
}
