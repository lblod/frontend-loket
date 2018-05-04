import Component from '@ember/component';

export default Component.extend({

  actions: {
    save(){
      this.get('onSave')();
    },
    cancel(){
      this.get('onCancel')();
    },
    discard(){
      this.get('onDiscard')();
    }
  }
});
