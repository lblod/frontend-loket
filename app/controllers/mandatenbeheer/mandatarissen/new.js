import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class MandatenbeheerMandatarissenNewController extends Controller {
  @action
    selectPersoon(persoon){
      this.transitionToRoute('mandatenbeheer.mandatarissen.edit', persoon.get('id'));
    }

  @action
    createNewPerson() {
      this.transitionToRoute('mandatenbeheer.mandatarissen.new-person');
    }

  @action
    cancel(){
      this.transitionToRoute('mandatenbeheer.mandatarissen');
    }
}
