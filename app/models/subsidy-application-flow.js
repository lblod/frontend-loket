/* eslint-disable ember/no-get */
import Model, { belongsTo, hasMany } from '@ember-data/model';

export default class SubsidyApplicationFlowModel extends Model {
  @belongsTo('subsidy-measure-offer-series', {
    async: true,
    inverse: null,
  })
  subsidyMeasureOfferSeries;

  @belongsTo('subsidy-application-flow-step', {
    async: true,
    inverse: null,
  })
  firstApplicationStep;

  @hasMany('subsidy-application-flow-step', {
    async: true,
    inverse: 'applicationFlow',
  })
  definedSteps;

  get sortedDefinedSteps() {
    return this.hasMany('definedSteps').value()?.slice().sort(sortByOrder);
  }
}

function sortByOrder(itemA, itemB) {
  return itemA?.order - itemB?.order;
}
