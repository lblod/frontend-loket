import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    setPersoon(persoon){
      let mandataris = this.get('store').createRecord('mandataris');
      mandataris.set('isBestuurlijkeAliasVan', persoon);
      this.set('mandataris', mandataris);
    },
    save(){
      this.transitionToRoute('mandatenbeheer.mandatarissen');
    },
    cancel(){
      this.transitionToRoute('mandatenbeheer.mandatarissen');
    }
  }
});
