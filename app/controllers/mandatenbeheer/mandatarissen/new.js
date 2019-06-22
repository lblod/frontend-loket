import Controller from '@ember/controller';

export default Controller.extend({
  selectPersoon(persoon){
    this.transitionToRoute('mandatenbeheer.mandatarissen.edit', persoon.get('id'));
  },
  actions: {
    createNewPerson() {
      this.transitionToRoute('mandatenbeheer.mandatarissen.new-person');
    },
    cancel(){
      this.transitionToRoute('mandatenbeheer.mandatarissen');
    }
  }
});
