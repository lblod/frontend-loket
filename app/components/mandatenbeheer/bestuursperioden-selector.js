import Component from '@ember/component';

export default Component.extend({

  actions: {
    select(periode) {
      this.set('selected', periode);
      this.onSelect(periode);
    }
  }
});
