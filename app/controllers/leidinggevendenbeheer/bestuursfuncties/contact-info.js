import Controller from '@ember/controller';

export default Controller.extend({
  dataIsGettingLost: false,
  newAddressData: null,

  exit() {
    this.set('newAdressData', null);
    this.set('dataIsGettingLost', false);
    this.transitionToRoute('leidinggevendenbeheer.functionarissen', this.model.id);
  },

  async saveData(){
    if(this.newAddressData){
      (await this.model.contactinfo).setProperties(this.newAddressData);
    }
    await (await this.model.contactinfo).save();
    await this.model.save();
  },

  hasUnsavedData(){
    return this.model.get('contactinfo.hasDirtyAttributes') || this.newAddressData;
  },

  actions: {
    annuleer() {
      this.set('dataIsGettingLost', false);
    },

    async save() {
      await this.saveData();
      this.exit();
    },

    cancel(){
      if (!this.hasUnsavedData()) this.exit();
      else {
        this.set('dataIsGettingLost', true);
      }
    },

    async dismissChanges() {
      (await this.model.contactinfo).rollbackAttributes();
      this.exit();
    },

    addressSelected(addressData){
      this.set('newAddressData', addressData);
    }
  }
});
