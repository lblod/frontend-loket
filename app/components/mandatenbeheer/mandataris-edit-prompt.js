import Component from '@ember/component';

export default Component.extend({
  actions: {
    terminate(){
      this.get('onTerminate')();
    },
    correct(){
      this.get('onCorrect')();
    }
  }
});
