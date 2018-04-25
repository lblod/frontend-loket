import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    onCreate(user) {
      this.transitionToRoute('mandatenbeheer.mandatarissen.new', {queryParams: {persoonId: user.get('id')}});
    },
    onCancel() {
      this.transitionToRoute('mandatenbeheer.mandatarissen.new', {queryParams: {persoonId: ''}});
    }
  }
});
