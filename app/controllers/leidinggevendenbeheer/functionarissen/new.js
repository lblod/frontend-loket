import Controller from '@ember/controller';

export default Controller.extend({
  //--- variables
  dataIsGettingLost: false,

  //--- methods
  exit() {
    this.set('dataIsGettingLost', false);
    this.transitionToRoute('leidinggevendenbeheer.functionarissen');
  },
  async hasDirtyAttributes(){
    const f = this.model.functionaris;
    const startHasChanged = f.start !== undefined;
    const eindeHasChanged = f.einde !== undefined;
    const statusHasChanged = (await f.status) !== this.model.defaultStatus;
    const hasPersoon = (await f.isBestuurlijkeAliasVan) !== null;

    return startHasChanged || eindeHasChanged || statusHasChanged || hasPersoon;
  },
  
  //--- actions
  actions: {
    annuleer(){
      this.set('dataIsGettingLost', false);
    },
    async bewaar(){
      await this.model.functionaris.save();
      this.transitionToRoute('leidinggevendenbeheer.functionarissen');
    },
    async cancel(){
      if (! await this.hasDirtyAttributes()) {
        this.exit();
      } else {
        //--- This will reveal the modal confirmation dialog
        this.set('dataIsGettingLost', true);
      }
    },
    async confirmChanges() {
      await this.model.functionaris.save();
      this.transitionToRoute('leidinggevendenbeheer.functionarissen');
    },
    dismissChanges() {
      this.exit();
    },
  }
});