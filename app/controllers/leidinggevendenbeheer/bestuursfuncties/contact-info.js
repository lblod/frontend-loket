import Controller from '@ember/controller';

export default Controller.extend({
  //--- variables
  dataIsGettingLost: false,
  
  //--- methods
  exit() {
    this.set('dataIsGettingLost', false);
    this.transitionToRoute('leidinggevendenbeheer.functionarissen', this.model.id);
  },
  
  //--- actions
  actions: {
    async annuleer() {
      this.set('dataIsGettingLost', false);
    },
    async bewaar() {
      await this.model.save();
      this.exit();
    },
    cancel() {
      if (! this.model.get('contactinfo.hasDirtyAttributes'))
      this.exit();
      else {
        this.set('dataIsGettingLost', true);
      }
    },
    async confirmChanges() {
      await (await this.model.contactinfo).save();
      await this.model.save();
      this.exit();
    },
    async dismissChanges() {
      (await this.model.contactinfo).rollbackAttributes();
      this.exit();
    },
    addressSelected(adressenRegister){

    }
  }
});
