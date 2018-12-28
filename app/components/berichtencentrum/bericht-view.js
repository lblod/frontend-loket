import Component from '@ember/component';

export default Component.extend({
  isExpanded: false,

  actions: {
    expand() {
      this.set("isExpanded", !this.isExpanded);
    }
  }
});
