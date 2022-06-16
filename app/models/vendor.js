import Model, { attr } from '@ember-data/model';

export default class Vendor extends Model {
  @attr name;
  @attr key;
}
