import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
export default class WorshipMinistersManagementNewPersonController extends Controller {
  @service() router;

  @action
  onCreate(person) {
    this.router.transitionTo('worship-ministers-management.new', {
      queryParams: {
        personId: person.id,
      },
    });
  }

  @action
  onCancel() {
    this.router.transitionTo('worship-ministers-management.new');
  }
}
