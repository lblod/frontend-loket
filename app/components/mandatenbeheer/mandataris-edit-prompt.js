import Component from '@ember/component';

export default Component.extend({
  actions: {
    terminate(){
      this.onTerminate();
    },
    correct(){
      this.onCorrect();
    }
  }
});
