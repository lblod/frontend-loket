import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SubsidyApplicationsEditStepIndexRoute extends Route {

  @service router;

  async beforeModel() {
    let {consumption, step} = this.modelFor('subsidy.applications.edit.step');

    let forms = await this.store.query('subsidy-application-form', {
      filter: {
        'subsidy-application-flow-step': {
          ':id:': step.id,
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

    if (form) {
      return this.router.replaceWith('subsidy.applications.edit.step.edit', consumption.id, step.id, form.id);
    } else {
      return this.router.replaceWith('subsidy.applications.edit.step.new', consumption.id, step.id);
    }
  }

}
