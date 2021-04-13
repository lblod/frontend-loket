import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SubsidyApplicationsEditIndexRoute extends Route {
  @service router;

  async model() {
    let consumption = this.modelFor('subsidy.applications.edit');
    let activeStep = await consumption.get('activeSubsidyApplicationFlowStep');

    // TODO: This check shouldn't be needed since this should always be set
    if (activeStep) {
      this.router.replaceWith('subsidy.applications.edit.step', activeStep.get('id'));
    }
  }
}

