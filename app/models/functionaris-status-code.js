import Model, { attr } from '@warp-drive/legacy/model';

export default class FunctionarisStatusCodeModel extends Model {
  @attr uri;
  @attr label;
  @attr scopeNote;
}
