import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SubsidyApplicationsEditStepIndexRoute extends Route {

  @service router;

  afterModel(model) {
    let {consumption, step, form} = model;
    if (form) {
      return this.router.replaceWith('subsidy.applications.edit.step.edit', consumption.id, step.id, form.id);
    } else {
      return this.router.replaceWith('subsidy.applications.edit.step.new', consumption.id, step.id);
    }
  }

}
