import Controller from '@ember/controller';
import { computed }  from '@ember/object';

export default Controller.extend({
  //--- variables
  /**
   * This route serves as a host for three subroutes: select-persoon, create-persoon and provide-details. This route also contains a close(x) button. Since those subroutes may have sensitive data, we need a mechanism to make sure about their internal state. The childController is a reference to the child route's controller. If a subroute has sensible data, it can utilize this property to register itself in this route.
   * 
  */
  childController: null,
  /**
   * When user clicks the close(x) button, this value is set to true
  */
  userHasRequestedToClose: false,

  //--- computed values
  /**
   * When user clicks the close(x) button, this value helps us determine whether the child route has unsaved data or not.
   */
  dataIsGettingLost: computed('childController', 'childController.hasUnsavedData','userHasRequestedToClose', function() {
    if (! this.childController)
      //--- If no reference is provided then it means that the child route (if any) doesn't have sensible data
      return false;
    else
      return this.childController.hasUnsavedData && this.userHasRequestedToClose;
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