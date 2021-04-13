import Model, { attr, hasMany } from '@ember-data/model';

export default class SubsidyMeasureOfferModel extends Model {
  @attr title;

  @hasMany('subsidy-measure-offer-series') series;
}
