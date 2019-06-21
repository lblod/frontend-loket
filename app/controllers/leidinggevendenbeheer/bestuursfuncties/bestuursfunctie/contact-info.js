import Controller from '@ember/controller';

export default Controller.extend({
  newAddressData: null,
  showConfirmationDialog: false,

  exit() {
    this.set('showConfirmationDialog', false);
    this.set('newAddressData', null);
    this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen', this.bestuursfunctie.id);
  },

  actions: {
    async save() {
      if(this.newAddressData){
        this.model.setProperties(this.newAddressData);
      }
      await this.model.save();
      this.exit();
    },

    cancel(){
      this.set('showConfirmationDialog', this.model.hasDirtyAttributes || this.newAddressData);
      if (! this.showConfirmationDialog)
        this.exit();
    },

    resetChanges() {
      this.model.rollbackAttributes();
      this.exit();
    },

    addressSelected(addressData){
      this.set('newAddressData', addressData);
    }
  }
});
