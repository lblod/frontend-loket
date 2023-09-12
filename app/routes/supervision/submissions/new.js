import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { CONCEPT_STATUS } from '../../../models/submission-document-status';

export default class SupervisionSubmissionsNewRoute extends Route {
  @service currentSession;
  @service router;
  @service store;

  async beforeModel() {
    const conceptStatuses = await this.store.query(
      'submission-document-status',
      {
        page: { size: 1 },
        'filter[:uri:]': CONCEPT_STATUS,
      }
    );

    if (conceptStatuses.length) {
      this.conceptStatus = conceptStatuses.at(0);
    }
  }

  async model() {
    const bestuurseenheid = this.currentSession.group;

    const submissionDocument = this.store.createRecord(
      'submissionDocument',
      {}
    );
    await submissionDocument.save();
    const currentUser = this.currentSession.user;
    const submission = this.store.createRecord('submission', {
      organization: bestuurseenheid,
      status: this.conceptStatus,
      submissionDocument,

      creator: currentUser,
      lastModifier: currentUser,
    });
    await submission.save();

    return submission;
  }

  afterModel(model) {
    this.router.transitionTo('supervision.submissions.edit', model.id);
  }
}
