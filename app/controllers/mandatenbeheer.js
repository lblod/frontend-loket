import Controller from '@ember/controller';

export default Controller.extend({
  selectedBestuursperioden: function() {
    return this.model.bestuursorgaanWithBestuursperioden.firstObject;
  },

  actions: {
    select(selectedBestuursperioden) {
      this.set('selectedBestuursperioden', selectedBestuursperioden);
    },
  }
});
