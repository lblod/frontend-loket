import Controller from '@ember/controller';

export default Controller.extend({
  newAddressData: null,
  showConfirmationDialog: false,

  exit() {
    this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen', this.bestuursfunctie.id);
  },

  /**
   * This method will do the housekeeping
   * It will reset any any unneeded internal state of the controller
   */
  reset() {
    this.set('newAddressData', null);
    this.set('showConfirmationDialog', false);
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
