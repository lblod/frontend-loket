import Model, { attr, belongsTo } from '@ember-data/model';

export default class SubsidyApplicationFlowStepModel extends Model {
  @attr order;

  /**
   * If no form-specification is supplied, a reference to an external form could be found here.
   */
  @attr isReplacedBy;

  @belongsTo('file') formSpecification;
  @belongsTo('subsidy-application-flow') applicationFlow;
  @belongsTo('subsidy-procedural-step') subsidyProceduralStep;

  // TODO: add form relationship
  @belongsTo('subsidy-application-flow-step', {
    inverse: 'nextApplicationStep'
  }) previousApplicationStep;

  @belongsTo('subsidy-application-flow-step', {
    inverse: 'previousApplicationStep'
  }) nextApplicationStep;

  get deadline() {
    return this.subsidyProceduralStep.get('period');
  }
}
