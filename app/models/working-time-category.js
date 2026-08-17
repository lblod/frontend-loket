import Model, { attr } from '@warp-drive/legacy/model';

export default class WorkingTimeCategoryModel extends Model {
  @attr uri;
  @attr label;
}
