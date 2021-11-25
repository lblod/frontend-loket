import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class SupervisionSubmissionsIndexController extends Controller {
  page = 0;
  size = 20;
  sort = 'status.label,-sent-date,-modified';

  @action
  reopen(submission) {
    if (confirm('Are you sure you wan\'t to do this? It might have unexpected consequences!'))
      this.store
          .findRecord('submission-document-status', '79a52da4-f491-4e2f-9374-89a13cde8ecd')
          .then(function(concept) {
            submission.status = concept;
            submission.save();
          });
  }
}
