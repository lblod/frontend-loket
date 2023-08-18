import Model, { attr, belongsTo } from '@ember-data/model';
import moment from 'moment';

export default class SubsidyMeasureOfferSeriesModel extends Model {
  @attr title;
  @attr description;

  @belongsTo('subsidy-application-flow', {
    async: true,
    inverse: null,
  })
  activeApplicationFlow;

  @belongsTo('period-of-time', {
    async: true,
    inverse: null,
  })
  period;

  @belongsTo('subsidy-measure-offer', {
    async: true,
    inverse: 'series',
  })
  subsidyMeasureOffer;

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

  /**
   * Returns if the series can be processed externally
   * - when it has a reference to an outside form
   * - when the subsidyProceduralStep of the firstApplicationStep is of type "Externally Processed"
   * @returns boolean
   */
  get isExternallyProcessed() {
    const activeApplicationFlow = this.belongsTo(
      'activeApplicationFlow'
    ).value();
    const firstApplicationStep = activeApplicationFlow
      .belongsTo('firstApplicationStep')
      .value();
    const externalProcessLink = firstApplicationStep.externalProcessLink;
    const isExternallyProcessed = firstApplicationStep
      .belongsTo('subsidyProceduralStep')
      .value().isExternallyProcessed;

    if (externalProcessLink && !isExternallyProcessed) {
      console.warn(
        'found a link to an external processes, but step is not marked for external processing.'
      );

      return false;
    } else if (!externalProcessLink && isExternallyProcessed) {
      console.warn(
        'found no link to an external processes, but step is marked for external processing.'
      );

      return true;
    }

    return externalProcessLink && isExternallyProcessed;
  }
}
