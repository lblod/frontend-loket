import Model, { attr, belongsTo } from '@ember-data/model';

export default class SubsidyRequestModel extends Model {
  @attr('date') dateOfRequest;

  @belongsTo('monetary-amount', {
    async: true,
    inverse: null,
  })
  requestedAmount;

  @belongsTo('subsidy-measure-consumption', {
    async: true,
    inverse: 'subsidyRequest',
  })
  subsidyMeasureConsumption;
}
