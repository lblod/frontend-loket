import Model, { attr, belongsTo } from '@ember-data/model';
import moment from 'moment';

export default class SubsidyMeasureOfferSeriesModel extends Model {
  @attr title;
  @attr description;
  @belongsTo('subsidy-application-flow') activeApplicationFlow;
  @belongsTo('period-of-time') period;
  @belongsTo('subsidy-measure-offer') subsidyMeasureOffer;

  get deadline() {
    return this.activeApplicationFlow.get('firstApplicationStep.subsidyProceduralStep.period');
  }

  get label() {
    if (this.title)
      return this.title;
    const begin = moment(this.period.get('begin')).format('YYYY');
    const end = moment(this.period.get('end')).format('YYYY');
    return `${begin} – ${end}`;
  }

  /**
   * Returns if the series can be processed externally
   * - when it has a reference to an outside form
   * - when the subsidyProceduralStep of the firstApplicationStep is of type ExternallyProcessed
   * @returns boolean
   */
  get isExternallyProcessed() {
    const isReplacedBy =
      this.activeApplicationFlow.get('firstApplicationStep.isReplacedBy');
    const isExternallyProcessed =
      this.activeApplicationFlow.get('firstApplicationStep.subsidyProceduralStep.isExternallyProcessed');
    if (isReplacedBy && !isExternallyProcessed) {
      console.warn('found a link to an external processes, but step is not marked for external processing.');
      return false;
    } else if (!isReplacedBy && isExternallyProcessed) {
      console.warn('found no link to an external processes, but step is marked for external processing.');
      return true;
    }
    return isReplacedBy && isExternallyProcessed;
  }
}

