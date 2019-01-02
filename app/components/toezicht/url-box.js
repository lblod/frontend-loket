import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  store: service(),

  saveAddress: task(function * (address){
    //TODO: this is needs probably some discussion with designer UX to tweak the XP. So now deactivated
    yield address.save();
    //In the future there will be some backend service checking wether file exists and can be downloaded
    //That's why we want to save it here. User needs to know immediately if his url is ok.
  }),

  actions: {
    addUrlField() {
      let address = this.store.createRecord('file-address');
      this.urls.pushObject(address);
    },

    delete(address){
      this.onDelete(address);
    },

    save(address){
      this.saveAddress.perform(address);
    }
  }
});
