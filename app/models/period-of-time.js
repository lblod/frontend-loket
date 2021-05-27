import Model, { attr } from '@ember-data/model';

export default class PeriodOfTimeModel extends Model {
  @attr('datetime') begin;
  @attr('datetime') end;
}
