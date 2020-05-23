import Model, {attr} from '@ember-data/model';

export default class TaxRate extends Model {
  @attr('number') amount;
  @attr('string') unit;
  @attr('string') base;
  @attr('string') remark;
}
