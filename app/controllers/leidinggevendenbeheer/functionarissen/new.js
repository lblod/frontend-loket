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
  
  //--- actions
  actions: {
    annuleer(){
      this.set('userHasRequestedToClose', false);
    },
    async bewaar(){
      await this.childController.save();
      this.exit();
    },
    async cancel(){
      this.set('userHasRequestedToClose', true);
      if (! this.dataIsGettingLost) {
        this.exit();
      }
    },
    async confirmChanges() {
      await this.childController.save();
      this.texit();
    },
    dismissChanges() {
      this.exit();
    },
  }
});