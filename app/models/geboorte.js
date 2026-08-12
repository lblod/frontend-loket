import Model, { attr } from '@warp-drive/legacy/model';

export default class GeboorteModel extends Model {
  @attr('date') datum;
}
