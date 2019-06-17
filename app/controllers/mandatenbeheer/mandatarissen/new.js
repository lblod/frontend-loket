import Controller from '@ember/controller';

export default Controller.extend({
  selectPersoon(persoon){
    this.transitionToRoute('mandatenbeheer.mandatarissen.edit', persoon.get('id'));
  },
  actions: {
    cancel(){
      this.transitionToRoute('mandatenbeheer.mandatarissen');
    }
  }
});
