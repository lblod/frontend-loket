import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class MinisterManagementIndexController extends Controller {
  @service router;

  @action
  newMinister() {
    this.router.transitionTo('minister-management.new');
  }
}
