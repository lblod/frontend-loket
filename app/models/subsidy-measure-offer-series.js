import Model, { attr, belongsTo } from '@ember-data/model';

export default class SubsidyMeasureOfferSeriesModel extends Model {
  @attr title;
  @attr description;
  @belongsTo('subsidy-application-flow') activeApplicationFlow;
  @belongsTo('period-of-time') period;
  @belongsTo('subsidy-measure-offer') subsidyMeasureOffer;
}
