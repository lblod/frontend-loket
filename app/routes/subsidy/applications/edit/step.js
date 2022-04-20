import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SubsidyApplicationsEditStepRoute extends Route {
  @service store;

  async model({ step_id: stepId }) {
    let { consumption } = this.modelFor('subsidy.applications.edit');
    let step = await this.store.findRecord(
      'subsidy-application-flow-step',
      stepId,
      {
        include: ['subsidy-procedural-step.period'].join(','),
      }
    );
    return {
      consumption,
      step,
    };
  }
}
