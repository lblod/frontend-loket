import Component from '@ember/component';

export default Component.extend({

  actions: {
    save(){
      this.onSave();
    },
    cancel(){
      this.onCancel();
    },
    discard(){
      this.onDiscard();
    }
  }
});
