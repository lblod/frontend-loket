import Controller from '@ember/controller';
import { computed }  from '@ember/object';

export default Controller.extend({
  //--- variables
  childController: null,
  userHasRequestedToClose: false,

  //--- computed values
  dataIsGettingLost: computed('childController', 'childController.hasUnsavedData','userHasRequestedToClose', function() {
    if (! this.childController) {
      return false;
    } else {
      return this.childController.hasUnsavedData && this.userHasRequestedToClose;
    }
  }),

  //--- methods
  exit() {
    this.set('childController', null);
    this.set('userHasRequestedToClose', false);
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
      this.set('userHasRequestedToClose', false);
    },
    async bewaar(){
      await this.childController.save();
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
      await this.childController.save();
    },
    dismissChanges() {
      this.exit();
    },
  }
});