/* eslint-disable ember/no-get, ember/classic-decorator-no-classic-methods */
import Model, { belongsTo, hasMany } from '@ember-data/model';

export default class SubsidyApplicationFlowModel extends Model {
  @belongsTo('subsidy-measure-offer-series') subsidyMeasureOfferSeries;
  @belongsTo('subsidy-application-flow-step', { inverse: null })
  firstApplicationStep;
  @hasMany('subsidy-application-flow-step', { inverse: 'applicationFlow' })
  definedSteps;

  get sortedDefinedSteps() {
    return this.hasMany('definedSteps').value()?.slice().sort(sortByOrder);
  }
}

function sortByOrder(itemA, itemB) {
  return itemA?.order - itemB?.order;
}
