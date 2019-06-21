import Controller from '@ember/controller';

export default Controller.extend({
  /**
   * This parameter toggles the close confirmation dialog
   */
  showConfirmationDialog: false,

  exit() {
    this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen');
  },

  /**
   * This method will do the housekeeping
   * It will reset any any unneeded internal state of the controller
   */
  reset(){
    this.set('showConfirmationDialog', false);
  },

  actions: {
    /**
     * This action is called for saving to the data store
     * and navigating back to the list of functionarissen.
     * It is triggered with either the 'Voeg aanstellingsperiode toe' button in the main UI
     * or the 'Bewaar' button in the close confirmation dialog
     */
    async applyModifications() {
      await this.model.functionaris.save();
      this.exit();
    },
    /**
     * This action is called when the close button on the top right side 
     * of the UI is clicked
     */
    async gentleCancel(){
      const statusHasChanged = this.model.initialStatus != await this.model.functionaris.status;
      const someOtherDataHasChanged = this.model.functionaris.hasDirtyAttributes;
      this.set('showConfirmationDialog', statusHasChanged || someOtherDataHasChanged);
      if (! this.showConfirmationDialog)
        this.exit();
    },
    /**
     * This action is called when the 'Annuleer' button is clicked
     * either in the main UI or in the close confirmation dialog
     */
    resetChanges() {
      this.model.functionaris.rollbackAttributes();
      this.model.functionaris.set('status', this.model.initialStatus),
      this.exit();
    }
  }
});
