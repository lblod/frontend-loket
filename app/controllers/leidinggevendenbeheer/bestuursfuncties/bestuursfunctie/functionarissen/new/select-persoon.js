import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    cancel(){
      this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen');
    },
    selectPersoon(persoon){
      this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.new.provide-details', persoon.id);
    }
  }
});
