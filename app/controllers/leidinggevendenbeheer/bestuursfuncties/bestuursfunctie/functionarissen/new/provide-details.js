import Controller from '@ember/controller';
import { computed }  from '@ember/object';

export default Controller.extend({
  isSaving: false,
  userHasRequestedToClose: false,
  userHasRequestedToSave: false,

  hasUnsavedData: computed('model.start', function() { return this.model.start }),
  hasErrors: computed('model.start', function() { return ! this.model.start }),
  showConfirmationDialog: computed('hasUnsavedData', 'userHasRequestedToClose', function(){
    return this.hasUnsavedData && this.userHasRequestedToClose;
  }),

  shallDisplayErrors: computed('hasErrors', 'userHasRequestedToSave', function() {
    return this.hasErrors && this.userHasRequestedToSave;
  }),

  exit() {
    this.set('userHasRequestedToClose', false);
    this.set('userHasRequestedToSave', false);
    this.set('isSaving', false);
    this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen');
  },

  actions: {
    async save() {
      this.set('userHasRequestedToSave', true);
      if(! this.hasErrors) {
        this.set('isSaving', true);
        await this.model.save();
        this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen');
      }
    },

    cancel(){
      if (!this.isSaving && !this.hasUnsavedData) {
        this.exit();
      } else {
        this.set('userHasRequestedToClose', true);
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
