import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SubsidyApplicationsEditStepRoute extends Route {
  @service store;

  async model({ step_id: stepId }) {
    let consumption = this.modelFor('subsidy.applications.edit');
    let step = await this.store.findRecord('subsidy-application-flow-step', stepId);


    // TODO: Set up the application form similar to how it was done in the edit route before
    // https://github.com/lblod/frontend-loket/blob/700febcd5267f2086fb238f9d2c79b704f3be992/app/routes/subsidy/applications/edit.js#L15

    return {
      consumption,
      step,
    };
  }

  resetController(controller) {
    controller.reset();
  }
}
