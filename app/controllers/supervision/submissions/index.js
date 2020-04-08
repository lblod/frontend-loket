import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class SupervisionSubmissionsIndexController extends Controller {
  page = 0
  size = 20
  sort = 'status.label,-sent-date'


  @action
  goToNewSubmission() {
    this.transitionToRoute('toezicht.inzendingen.new');
  }
}
