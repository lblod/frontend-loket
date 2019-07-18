import Component from '@ember/component';

export default Component.extend({
  actions: {
    select(selectedAddress){
      this.onSelect(selectedAddress);
      this.set('_address', selectedAddress);
    }
  }
});
