import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    async setPersoon(persoon){
      this.set('persoon', persoon);
    },
    async save(){
      this.transitionToRoute('mandatenbeheer.mandatarissen');
    },
    cancel(){
      this.transitionToRoute('mandatenbeheer.mandatarissen');
    }
  }
});
