import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    onCreate(persoon) {
      this.transitionToRoute('leidinggevendenbeheer.functionarissen.new.provide-details', persoon.id);
    },
    onCancel() {
      this.transitionToRoute('leidinggevendenbeheer.functionarissen');
    },
    gotoPreviousStep() {
      this.transitionToRoute('leidinggevendenbeheer.functionarissen.new.select-persoon');
    },
    cancel() {
      this.transitionToRoute('leidinggevendenbeheer.functionarissen');
    },
  }
});