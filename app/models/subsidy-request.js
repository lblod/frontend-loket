import Model, { attr, belongsTo } from '@ember-data/model';

export default class SubsidyRequestModel extends Model {
  @attr('date') dateOfRequest;
  @belongsTo('monetary-amount') requestedAmount;
  @belongsTo('subsidy-measure-consumption') subsidyMeasureConsumption;
}
