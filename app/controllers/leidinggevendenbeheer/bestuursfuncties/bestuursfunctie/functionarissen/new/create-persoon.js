import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    onCreate(persoon) {
      this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.new.provide-details', persoon.id);
    },
    /**
     * This is called when the 'Annuleer' button is clicked
     * in the main UI
     * or in the (to be) confirmation dialog
     */
    resetChanges() {
      this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen');
    },
    gotoPreviousStep() {
      this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.new.select-persoon');
    },
    /**
     * This is called when the x button is clicked
     * on the top right side of the main UI
     * 
     * This is meant to be used for showing a confirmation dialog like the provide-details route.
     * However, we currently don't show any. TODO: Discuss with the designer.
     */
    gentleCancel() {
      this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen');
    }
  }
});
