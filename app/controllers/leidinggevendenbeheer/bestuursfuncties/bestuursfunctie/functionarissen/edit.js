import Controller from '@ember/controller';

export default Controller.extend({
  isSaving: false,
  showConfirmationDialog: false,

  exit() {
    this.set('showConfirmationDialog', false);
    this.set('isSaving', false);
    this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen');
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
