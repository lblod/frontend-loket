import Controller from '@ember/controller';
import { computed }  from '@ember/object';

export default Controller.extend({
  newAddressData: null,
  showConfirmationDialog: false,

  isDirty: computed('model.hasDirtyAttributes', 'newAddress', function() {
    return this.model.hasDirtyAttributes || this.newAddressData;
  }),

  exit() {
    this.set('showConfirmationDialog', false);
    this.set('newAddressData', null);
    this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen', this.bestuursfunctie.id);
  },

  actions: {
    async save() {
      if (this.newAddressData){
        var adres = await this.model.adres;
        adres.setProperties(this.newAddressData);
      }
      await adres.save();
      this.model.set('adres', adres);
      await this.model.save();

      this.exit();
    },

    cancel(){
      if (! this.isDirty)
        this.exit();
      else
        this.set('showConfirmationDialog', true);
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
