import Model, { attr, hasMany } from '@ember-data/model';

export default class SubsidyMeasureOfferModel extends Model {
  @attr title;
  @attr externalInformation;

  @hasMany('subsidy-measure-offer-series', {
    async: true,
    inverse: 'subsidyMeasureOffer',
  })
  series;
}
