import Component from '@ember/component';

export default Component.extend({

  actions: {
    confirm(){
      this.get('onConfirm')();
    },
    cancel(){
      this.get('onCancel')();
    }
  }
});
