import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    cancel(){
      this.transitionToRoute('leidinggevendenbeheer.functionarissen');
    },
    setPersoon(persoon){
      this.transitionToRoute('leidinggevendenbeheer.functionarissen.new.provide-details', persoon.id);
    }
  }
});
