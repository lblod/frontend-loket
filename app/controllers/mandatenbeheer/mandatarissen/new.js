import Controller from '@ember/controller';

export default Controller.extend({
  clearProperties(){
    this.set('mandataris', null);
  },
  createPersoon: false,
  actions: {
    setPersoon(persoon){
      let mandataris = this.get('store').createRecord('mandataris');
      mandataris.set('isBestuurlijkeAliasVan', persoon);
      this.set('mandataris', mandataris);
    },
    toggleCreate() {
      this.toggleProperty('createPersoon');
    },
    save(){
      this.transitionToRoute('mandatenbeheer.mandatarissen');
    },
    cancel(){
      this.transitionToRoute('mandatenbeheer.mandatarissen');
    }
  }
});
