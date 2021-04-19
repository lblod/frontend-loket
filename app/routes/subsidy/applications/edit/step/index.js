import Route from '@ember/routing/route';

export default class SubsidyApplicationsEditStepIndexRoute extends Route {

  afterModel(model) {
    let {consumption, step, form} = model;
    if (form) {
      return this.replaceWith('subsidy.applications.edit.step.edit', consumption.id, step.id, form.id);
    } else {
      return this.replaceWith('subsidy.applications.edit.step.new', consumption.id, step.id);
    }
  }

}
