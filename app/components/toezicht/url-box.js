import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  disabled: false,

  actions: {
    addUrlField() {
      let address = this.store.createRecord('file-address');
      this.urls.pushObject(address);
    },

    delete(address){
      this.onDelete(address);
    }
  }
});
