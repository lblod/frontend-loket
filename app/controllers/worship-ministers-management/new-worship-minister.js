import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
export default class WorshipMinistersManagementNewWorshipMinisterController extends Controller {
  @service() router;

  @action
  onCreate(person) {
    this.router.transitionTo('worship-ministers-management.minister.edit', {
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
