import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { CONCEPT_STATUS_UUID } from '../../../models/submission-document-status';

export default class SupervisionSubmissionsIndexController extends Controller {
  @service router;

  page = 0;
  size = 20;
  sort = 'status.label,-sent-date,-modified';

  @action
  reopen(submission) {
    const hasAcknowledged = confirm(
      'Weet je zeker dat je dit wilt doen? Deze actie kan onverwachte gevolgen hebben!'
    );
    if (hasAcknowledged) {
      this.store
        .findRecord('submission-document-status', CONCEPT_STATUS_UUID)
        .then(function (concept) {
          submission.status = concept;
          submission.sentDate = null;
          submission.save();
        });
    }
  }
}
