import Controller from '@ember/controller';

export default Controller.extend({
  isSaving: false,
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
    this.set('isSaving', false);
  },

  actions: {
    async applyModifications() {
      this.set('isSaving', true);
      await this.model.functionaris.save();
      this.exit();
    },

    async cancel(){
      if (!this.isSaving) {
        const statusHasChanged = this.model.initialStatus != await this.model.functionaris.status;
        const someOtherDataHasChanged = this.model.functionaris.hasDirtyAttributes;
        this.set('showConfirmationDialog', statusHasChanged || someOtherDataHasChanged);
        if (! this.showConfirmationDialog)
          this.exit();
      }
    },

    resetChanges() {
      this.model.functionaris.rollbackAttributes();
      this.model.functionaris.set('status', this.model.initialStatus),
      this.exit();
    }
  }
});
