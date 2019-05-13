import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    onCreate(persoon) {
      this.model.functionaris.set('isBestuurlijkeAliasVan', persoon);
      this.transitionToRoute('leidinggevendenbeheer.functionarissen.new.provide-details');
    },
    onCancel() {
      this.transitionToRoute('leidinggevendenbeheer.functionarissen');
    },
    gotoPreviousStep() {
      this.transitionToRoute('leidinggevendenbeheer.functionarissen.new.select-persoon');
    }
  }
});