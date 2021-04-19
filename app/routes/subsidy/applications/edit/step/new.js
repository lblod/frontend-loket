import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { CONCEPT_STATUS } from '../../../../../models/submission-document-status';

export default class SubsidyApplicationsEditStepNewRoute extends Route {

  @service currentSession;

  async beforeModel() {
    const conceptStatuses = await this.store.query('submission-document-status', {
      page: {size: 1},
      'filter[:uri:]': CONCEPT_STATUS,
    });

    if (conceptStatuses.length)
      this.conceptStatus = conceptStatuses.firstObject;
  }

  async model() {
    let {consumption} = this.modelFor('subsidy.applications.edit');
    let {step} = this.modelFor('subsidy.applications.edit.step');

    const spec = await step.get('formSpecification');

    let form = this.store.createRecord('subsidy-application-form', {
      creator: this.currentSession.userContent,
      lastModifier: this.currentSession.userContent,
      subsidyApplicationFlowStep: step,
      subsidyMeasureConsumption: consumption,
      status: this.conceptStatus,
    });

    form.sources.pushObject(spec);
    await form.save();

    consumption.subsidyApplicationForms.pushObject(form);
    await consumption.save();

    return {consumption, step, form};
  }

  afterModel(model) {
    let {consumption, step, form} = model;
    this.replaceWith('subsidy.applications.edit.step.edit', consumption.id, step.id, form.id);
  }
}
