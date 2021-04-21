import Route from '@ember/routing/route';

export default class SubsidyApplicationsEditStepRoute extends Route {

  async model({id: consumptionId, step_id: stepId}) {
    let {consumption} = this.modelFor('subsidy.applications.edit');
    let step = await this.store.findRecord('subsidy-application-flow-step', stepId);
    return {
      consumption,
      step,
    };
  }

}
