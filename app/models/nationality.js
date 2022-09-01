import Model, { attr } from '@ember-data/model';

export default class NationalityModel extends Model {
  @attr countryLabel;
  @attr nationalityLabel;
}
