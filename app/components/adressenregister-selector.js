import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import fetch from 'fetch';

export default Component.extend({

  search: task(function* (searchData) {
    yield timeout(400);
    let result =  yield fetch(`/adressenregister/search?query=${searchData}`);
    if (result.ok){
      let addresses = yield result.json();
      return addresses['adressen'];
    }
    return [];
  }),

  getDetailForOverviewItem: task(function* (overviewAddress){
    //the api returns only a 'summary', we need to fetch details.
    this.set('_address', null);
    let result =  yield fetch(`/adressenregister/detail?uri=${overviewAddress.detail}`);
    if (result.ok){
      let adresRegister = yield result.json();
      this.set('_address', adresRegister);
      this.onSelect(adresRegister);
    }
  }),

  actions: {
    async select(overviewAddress){
      await this.getDetailForOverviewItem.perform(overviewAddress);
    }
  }
});
