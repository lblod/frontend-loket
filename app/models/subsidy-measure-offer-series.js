import Model, { attr, belongsTo } from '@ember-data/model';
import moment from 'moment';

export default class SubsidyMeasureOfferSeriesModel extends Model {
  @attr title;
  @attr description;
  @belongsTo('subsidy-application-flow') activeApplicationFlow;
  @belongsTo('period-of-time') period;
  @belongsTo('subsidy-measure-offer') subsidyMeasureOffer;

  get deadline() {
    return this.activeApplicationFlow.get(
      'firstApplicationStep.subsidyProceduralStep.period'
    );
  }

  get label() {
    if (this.title) return this.title;
    const begin = moment(this.period.get('begin')).format('YYYY');
    const end = moment(this.period.get('end')).format('YYYY');
    return `${begin} – ${end}`;
  }
}
