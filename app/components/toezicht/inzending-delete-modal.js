import Component from '@ember/component';

export default Component.extend({

  actions: {
    confirm(){
      this.onConfirm();
    },
    cancel(){
      this.onCancel();
    }
  }
});
