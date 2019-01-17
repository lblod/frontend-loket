import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    saveMandataris() {
      this.send('reloadModel');
    },
    finish(){
      this.transitionToRoute('mandatenbeheer.mandatarissen');
    }
  }
});
