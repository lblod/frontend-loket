import Controller from '@ember/controller';
import { isBlank } from '@ember/utils';
import { observer } from '@ember/object';

export default Controller.extend({
  setPersoon(persoon){
    this.transitionToRoute('mandatenbeheer.mandatarissen.edit', persoon.get('id'));
  },
  actions: {
    cancel(){
      this.transitionToRoute('mandatenbeheer.mandatarissen');
    }
  }
});
