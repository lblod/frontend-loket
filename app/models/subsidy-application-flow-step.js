import Model, { attr, belongsTo } from '@ember-data/model';

export default class SubsidyApplicationFlowStepModel extends Model {
  @attr order;
  // A reference to an external procedure (application flow step)
  @attr externalProcessLink;

  @belongsTo('file', {
    async: true,
    inverse: null,
  })
  formSpecification;

  @belongsTo('subsidy-application-flow', {
    async: true,
    inverse: 'definedSteps',
  })
  applicationFlow;

  @belongsTo('subsidy-procedural-step', {
    async: true,
    inverse: null,
  })
  subsidyProceduralStep;

  // TODO: add form relationship
  @belongsTo('subsidy-application-flow-step', {
    async: true,
    inverse: 'nextApplicationStep',
  })
  previousApplicationStep;

  @belongsTo('subsidy-application-flow-step', {
    async: true,
    inverse: 'previousApplicationStep',
  })
  nextApplicationStep;

  get deadline() {
    return this.subsidyProceduralStep.get('period');
  }
}
