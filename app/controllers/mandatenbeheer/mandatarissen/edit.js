import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class MandatenbeheerMandatarissenEditController extends Controller {
  @action
    saveMandataris() {
      this.send('reloadModel');
    }

  @action
    finish(){
      this.transitionToRoute('mandatenbeheer.mandatarissen');
    }
}
