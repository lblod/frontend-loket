import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { CONCEPT_STATUS } from '../../../models/submission-document-status';

export default class SubsidyApplicationsNewRoute extends Route {
  @service currentSession

  async beforeModel() {
    const conceptStatuses = await this.store.query('submission-document-status', {
      page: { size: 1 },
      'filter[:uri:]': CONCEPT_STATUS
    });

    if (conceptStatuses.length)
      this.conceptStatus = conceptStatuses.firstObject;
  }

  async model() {
    const bestuurseenheid = await this.currentSession.group;

    const contactinfo = this.store.createRecord('contact-punt');
    const bankAccount = this.store.createRecord('bank-account');

    await contactinfo.save();
    await bankAccount.save();

    const currentUser = await this.currentSession.user;
    const applicationForm = this.store.createRecord('application-form', {
      organization: bestuurseenheid,
      status: this.conceptStatus,
      creator: currentUser,
      lastModifier: currentUser,
      // NOTE boilerplate objects
      contactinfo,
      bankAccount
    });

    await applicationForm.save();

    return applicationForm;
  }

  afterModel(model) {
    this.transitionTo('subsidy.applications.edit', model.id);
  }
}
