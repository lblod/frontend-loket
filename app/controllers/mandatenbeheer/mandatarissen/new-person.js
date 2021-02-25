import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class MandatenbeheerMandatarissenNewPersonController extends Controller {
  @action
    onCreate(user) {
      this.transitionToRoute('mandatenbeheer.mandatarissen.edit', user.get('id'));
    }

  @action
    onCancel() {
      this.transitionToRoute('mandatenbeheer.mandatarissen.new');
    }
}
