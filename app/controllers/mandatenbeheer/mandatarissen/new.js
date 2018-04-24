import Controller from '@ember/controller';

export default Controller.extend({
  clearProperties(){
    this.set('mandataris', null);
  },
  actions: {
    setPersoon(persoon){
      let mandataris = this.get('store').createRecord('mandataris');
      mandataris.set('isBestuurlijkeAliasVan', persoon);
      this.set('mandataris', mandataris);
    },
  createPersoon: false,
  actions: {
    async setPersoon(persoon){
      this.set('createPersoon', false);
      console.log(persoon);
      this.set('persoon', persoon);
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
