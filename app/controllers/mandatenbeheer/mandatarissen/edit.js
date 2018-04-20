import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    save(){
      this.transitionToRoute('mandatenbeheer.mandatarissen');
    },
    cancel(){
      this.transitionToRoute('mandatenbeheer.mandatarissen');
    }
  }
});
