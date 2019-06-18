import Controller from '@ember/controller';
import { computed }  from '@ember/object';

export default Controller.extend({
  /**
   * This is set to true when the close button is clicked
   * on the top right side of the UI
   */
  userHasRequestedToClose: false,

  /**
   * This is set to true when the 'Voeg aanstellingsperiode to' button is clicked
   * in the main UI
   */
  userHasRequestedToSave: false,
  
  hasUnsavedData: computed('model.start', function() { return this.model.start }),

  /**
   * This indicates that all required fields of the functionaris object are set
   */
  hasErrors: computed('model.start', function() { return ! this.model.start }),
  
  /**
   * This indicates that users has made some modifications
   * and has requested to close without saving them
   */
  dataIsGettingLost: computed('hasUnsavedData', 'userHasRequestedToClose', function(){
    return this.hasUnsavedData && this.userHasRequestedToClose;
  }),

  /**
   * This boolean value hides or reveals the close confirmation dialog
   */
  shallDisplayErrors: computed('hasErrors', 'userHasRequestedToSave', function() {
    return this.hasErrors && this.userHasRequestedToSave;
  }),

  exit() {
    this.transitionToRoute('leidinggevendenbeheer.functionarissen');
  },

  /**
   * This method will do the housekeeping
   * It will reset any any unneeded internal state of the controller
   */
  reset(){
    this.set('userHasRequestedToClose', false);
    this.set('userHasRequestedToSave', false);
  },

  actions: {
    /**
     * This action is called for saving to the data store
     * and navigating back to the list of functionarissen.
     * It is triggered with the 'Voeg aanstellingsperiode to' button in the main UI
     */
    async addPeriod() {
      this.set('userHasRequestedToSave', true);
      if(! this.hasErrors) {
        await this.model.save();
        const bestuursfunctieId = this.model.get('bekleedt.id');
        //This is a 'trick/hack' to send an event to refresh the model, which will bubble up.
        //Until a consumer acts on it
        this.send('reloadModelLeidinggevendenbeheerFunctionarissen');
        this.transitionToRoute('leidinggevendenbeheer.functionarissen', bestuursfunctieId, { queryParams: { page: 0 } });
      }
    },

    /**
     * This action is called when 'Bewaar' button is clicked
     * in the confirmation dialog
     */
    async bewaar(){
      if(! this.hasErrors) {
        await this.model.save();
        this.exit();
      }
    },

    /**
     * This action is called when the close button on the top right side 
     * of the UI is clicked
     */
    async gentleCancel(){
      if (! this.hasUnsavedData) {
        this.exit();
      } else {
        this.set('userHasRequestedToClose', true);
      }
    },

    gotoPreviousStep() {
      this.transitionToRoute('leidinggevendenbeheer.functionarissen.new.select-persoon');
    },

    /**
     * This action is called when the 'Annuleer' button is clicked
     * either in the main UI or in the close confirmation dialog
     */
    immediateCancel() {
      this.exit();
    }
  }
});
