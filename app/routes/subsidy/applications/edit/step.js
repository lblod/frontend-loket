import Route from '@ember/routing/route';

export default class SubsidyApplicationsEditStepRoute extends Route {

  async model({id: consumptionId, step_id: stepId}) {
    let {consumption} = this.modelFor('subsidy.applications.edit');
    let step = await this.store.findRecord('subsidy-application-flow-step', stepId);

    let forms = await this.store.query('subsidy-application-form', {
      filter: {
        'subsidy-application-flow-step': {
          ':id:': stepId,
        },
        'subsidy-measure-consumption': {
          ':id:': consumption.id,
        },
      },
    });

    /**
     * NOTE: for now hardcoded with the assumption "one step has only one form"
     */
    const form = forms.firstObject;

    return {
      consumption,
      step,
      form,
    };
  }

}
