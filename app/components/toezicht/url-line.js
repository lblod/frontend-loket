import Component from '@ember/component';

export default Component.extend({
  actions: {
    delete(address){
      this.onDelete(address);
    },
  }
});
