import Route from '@ember/routing/route';
import SubsidyMeasureConsumptionModel from '../../../../models/subsidy-measure-consumption';

export default class SubsidyApplicationsIndexRoute extends Route {

  /**
   * Redirect to the most BLANK step to be show to the user
   *
   * NOTE: always assumes a consumption to have the proper model defined.
   */
  async beforeModel(model) {

    let {consumption} = this.modelFor('subsidy.applications.edit');

    /**
     * NOTE: first we always try to transition to the defined active-step.
     */
    let active = await consumption.get('activeSubsidyApplicationFlowStep');
    if (active) {
      return this.redirectToStep(consumption, active);
    }

    // TODO: fallback when no steps are defined.

    /**
     * NOTE: if no active-step was found and the consumption has been sent we transition to the last step.
     */
    if (SubsidyMeasureConsumptionModel.isSent(consumption)) {
      const last = await consumption.subsidyApplicationFlow.get('definedSteps').lastObject;
      return this.redirectToStep(consumption, last);
    }

    /**
     * NOTE: we default back to the first step.
     */
    const first = await consumption.subsidyApplicationFlow.get('definedSteps').firstObject;
    return this.redirectToStep(consumption, first);
  }

  redirectToStep(consumption, step) {
    return this.replaceWith('subsidy.applications.edit.step', consumption.id, step.id);
  }
}
