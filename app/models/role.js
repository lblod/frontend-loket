import Model, { attr } from '@warp-drive/legacy/model';

/** This is duplicate of `rol` model but written in english */
export default class RoleModel extends Model {
  @attr label;
}
