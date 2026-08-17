import Model, { attr } from '@warp-drive/legacy/model';

export default class NationalityModel extends Model {
  @attr countryLabel;
  @attr nationalityLabel;
}
