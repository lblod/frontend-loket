import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { tracked } from '@glimmer/tracking';

export default class SubsidyMeasureConsumptionModel extends Model {
  // This flag can be used to mark this record "instable". It shouldn't be possible to delete instable records.
  // Note that we assume there will only ever be 1 action that manipulates this value at the same time.
  // If it needs to be possible to run actions concurrently this should replaced by an array
  // of concurrency task instances and a getter which returns true if no tasks are running.
  @tracked isStable = true;

  @attr('datetime') created;
  @attr('datetime') modified;

  @belongsTo('gebruiker', {
    async: true,
    inverse: null,
  })
  creator;

  @belongsTo('gebruiker', {
    async: true,
    inverse: null,
  })
  lastModifier;

  @belongsTo('subsidy-request', {
    async: true,
    inverse: 'subsidyMeasureConsumption',
  })
  subsidyRequest;

  @belongsTo('subsidy-measure-offer', {
    async: true,
    inverse: null,
  })
  subsidyMeasureOffer;

  @belongsTo('subsidy-application-flow', {
    async: true,
    inverse: null,
  })
  subsidyApplicationFlow;

  @belongsTo('subsidy-application-flow-step', {
    async: true,
    inverse: null,
  })
  activeSubsidyApplicationFlowStep;

  @belongsTo('subsidy-measure-consumption-status', {
    async: true,
    inverse: null,
  })
  status;

  @hasMany('participation', {
    async: true,
    inverse: null,
  })
  participations;

  @hasMany('subsidy-application-form', {
    async: true,
    inverse: 'subsidyMeasureConsumption',
  })
  subsidyApplicationForms;

  get deadline() {
    if (this.activeSubsidyApplicationFlowStep)
      return this.activeSubsidyApplicationFlowStep.get(
        'subsidyProceduralStep.period'
      );
    return undefined;
  }
}
