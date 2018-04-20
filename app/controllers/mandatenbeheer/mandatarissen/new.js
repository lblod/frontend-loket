import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    setPersoon(persoon){
      this.set('persoon', persoon);
    },
    save(){
      this.transitionToRoute('mandatenbeheer.mandatarissen');
    },
    cancel(){
      this.transitionToRoute('mandatenbeheer.mandatarissen');
    }
  }
});
