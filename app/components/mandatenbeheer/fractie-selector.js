import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  store: service(),

  didReceiveAttrs(){
    this.set('_fractie', this.get('fractie'));
  },

  searchByName: task(function* (searchData) {
    yield timeout(300);
    let queryParams = {
      sort:'naam',
      'filter[naam]': searchData
    };
    return yield this.get('store').query('fractie', queryParams);
  }),

  actions: {
    select(fractie){
      this.set('_fractie', fractie);
      this.get('onSelect')(fractie);
    }
  }
});
