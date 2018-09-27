import Component from '@ember/component';

export default Component.extend({
  classNames:['u-padding--trl--small u-border--light--bottom'],

  actions: {
    close(){
      this.onClose();
    }
  }
});
