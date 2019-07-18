import Controller from '@ember/controller';

export default Controller.extend({
  page: 0,
  size: 20,
  sort: 'status.label,-sent-date',

  actions: {
    goToNewInzending() {
      this.transitionToRoute('toezicht.inzendingen.new');
    }
  }
});
