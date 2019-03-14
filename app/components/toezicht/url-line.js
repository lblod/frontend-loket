import Component from '@ember/component';

export default Component.extend({
  tagName: "tr",
  actions: {
    delete(address){
      this.onDelete(address);
    },
  }
});
