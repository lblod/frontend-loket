import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MandatenbeheerMandatarissenNewPersonController extends Controller {
  @service() router;

  @action
    onCreate(user) {
      this.router.transitionTo('mandatenbeheer.mandatarissen.edit', user.get('id'));
    }

  @action
    onCancel() {
      this.router.transitionTo('mandatenbeheer.mandatarissen.new');
    }
}
