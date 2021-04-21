import Model, { belongsTo, hasMany } from '@ember-data/model';

export default class SubsidyApplicationFlowModel extends Model {

  @belongsTo('subsidy-measure-offer-series') subsidyMeasureOfferSeries;
  @belongsTo('subsidy-application-flow-step', { inverse: 'applicationFlow'}) firstApplicationStep;
  @hasMany('subsidy-application-flow-step') definedSteps;

  get sortedDefinedSteps() {
      return this.get('definedSteps').sortBy('order');
  }
}
