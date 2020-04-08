import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class SupervisionSubmissionsIndexController extends Controller {
  page = 0
  size = 20
  sort = 'status.label,-sent-date,-modified'


  @action
  goToNewSubmission() {
    this.transitionToRoute('supervision.submissions.new');
  }
}
