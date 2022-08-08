import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class WorshipMinistersManagementMinisterEditController extends Controller {
  @service currentSession;
  @service store;
  @service router;

  @action
  onCancel() {
    this.router.transitionTo('worship-ministers-management');
  }
}
