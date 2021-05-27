import Model, { attr, belongsTo } from '@ember-data/model';

export default class SubsidyApplicationFlowStepModel extends Model {
  @attr order;

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
