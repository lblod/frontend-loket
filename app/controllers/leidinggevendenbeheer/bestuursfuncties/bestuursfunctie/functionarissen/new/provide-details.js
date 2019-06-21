import Controller from '@ember/controller';
import { computed }  from '@ember/object';

export default Controller.extend({
  isSaving: false,

  hasUnsavedData: computed('model.start', function() { return this.model.start; }),
  hasErrors: computed('model.start', function() { return ! this.model.start; }),

  exit() {
    this.set('showConfirmationDialog', false);
    this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen');
  },

  actions: {
    async save() {
      if(! this.hasErrors) {
        this.set('isSaving', true);
        await this.model.save();
        this.set('isSaving', false);
        this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen');
      } else {
        this.set('showConfirmationDialog', true);
      }
    },

    cancel(){
      if (!this.isSaving && !this.hasUnsavedData) {
        this.exit();
      } else {
        this.set('showConfirmationDialog', true);
      }
    },

    gotoPreviousStep() {
      this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.new.select-persoon');
    },

    resetChanges() {
      this.exit();
    }
  }
});
