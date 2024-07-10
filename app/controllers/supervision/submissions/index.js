import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { CONCEPT_STATUS } from 'frontend-loket/models/submission-document-status';

export default class SupervisionSubmissionsIndexController extends Controller {
  @service router;
  @service store;

  page = 0;
  size = 20;
  sort = '-modified';

  @action
  async reopen(submission) {
    const hasAcknowledged = confirm(
      'Weet je zeker dat je dit wilt doen? Deze actie kan onverwachte gevolgen hebben!',
    );

    if (hasAcknowledged) {
      const concept = (
        await this.store.query('submission-document-status', {
          filter: {
            ':uri:': CONCEPT_STATUS,
          },
        })
      ).at(0);

      submission.status = concept;
      submission.sentDate = null;
      submission.save();
    }
  }
}
