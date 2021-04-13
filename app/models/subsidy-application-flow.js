import Model, { belongsTo, hasMany } from '@ember-data/model';

export default class SubsidyApplicationFlowModel extends Model {
  @belongsTo('subsidy-measure-offer-series') subsidyMeasureOfferSeries;
  @hasMany('subsidy-application-flow-step') definedSteps;
}
