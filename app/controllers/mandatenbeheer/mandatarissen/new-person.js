import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    onCreate(user) {
      const mandataris = this.get('store').createRecord('mandataris');
      mandataris.set('isBestuurlijkeAliasVan', user);
      this.transitionToRoute('mandatenbeheer.mandatarissen.edit', mandataris);
    },
    onCancel() {
      this.transitionToRoute('mandatenbeheer.mandatarissen');
    }
  }
});
