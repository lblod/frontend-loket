import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MandatenbeheerMandatarissenNewController extends Controller {
  @service() router;

  @action
    selectPersoon(persoon){
      this.router.transitionTo('mandatenbeheer.mandatarissen.edit', persoon.get('id'));
    }

  @action
    createNewPerson() {
      this.router.transitionTo('mandatenbeheer.mandatarissen.new-person');
    }

  @action
    cancel(){
      this.router.transitionTo('mandatenbeheer.mandatarissen');
    }
}
