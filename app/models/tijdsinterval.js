import Model, { attr } from '@warp-drive/legacy/model';

export default class TijdsintervalModel extends Model {
  @attr('date') begin;
  @attr('date') einde;
}
