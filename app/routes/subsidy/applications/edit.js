import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import SubsidyMeasureConsumptionModel from '../../../models/subsidy-measure-consumption';

export default class SubsidyApplicationsEditRoute extends Route {

  @service store;
  @service('current-session') session;

  async model({id: subsidyMeasureConsumptionId}) {
    const consumption = await this.store.findRecord('subsidy-measure-consumption', subsidyMeasureConsumptionId, {
      include: [
        'active-subsidy-application-flow-step',
        'status',
        'subsidy-measure-offer',
        'subsidy-application-flow.defined-steps.subsidy-procedural-step',
        'subsidy-application-flow.subsidy-measure-offer-series.period',
        'participations.participating-bestuurseenheid',
        'last-modifier',
      ].join(','),
    });

    const organization = await this.session._group;

    return {
      consumption,
      organization,
    };
  }

  /**
   * Redirect to the most BLANK step to be show to the user
   *
   * NOTE: always assumes a consumption to have the proper model defined.
   */
  async redirect(model, transition) {
    const consumption = model.consumption;

    /**
     * NOTE: first we always try to transition to the defined active-step.
     */
    let active = await consumption.get('activeSubsidyApplicationFlowStep');
    if (active) {
      return await this.redirectToStep(active);
    }

    // TODO: fallback when no steps are defined.

    /**
     * NOTE: if no active-step was found and the consumption has been sent we transition to the last step.
     */
    if (SubsidyMeasureConsumptionModel.isSent(consumption)) {
      const last = await consumption.subsidyApplicationFlow.get('definedSteps').lastObject;
      return await this.redirectToStep(last);
    }

    /**
     * NOTE: we default back to the first step.
     */
    const first = await consumption.subsidyApplicationFlow.get('definedSteps').firstObject;
    return await this.redirectToStep(first);
  }

  async redirectToStep(model) {
    return this.transitionTo('subsidy.applications.edit.step', model.id);
  }
}
