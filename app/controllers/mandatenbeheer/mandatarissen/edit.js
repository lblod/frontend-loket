import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    finish(){
      this.transitionToRoute('mandatenbeheer.mandatarissen');
    }
  }
});
