import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import fetch from 'fetch';

export default Component.extend({
  async didReceiveAttrs(){
    if(this.adres.get('volledigAdres')) {
      this.set('_address', { FormattedAddress : await this.adres.get('volledigAdres') });
    }
  },

  search: task(function* (searchData) {
    yield timeout(400);
    const result =  yield fetch(`/adressenregister/search?query=${searchData}`);
    if (result.ok){
      const addresses = yield result.json();
      return addresses['adressen'];
    }
    return [];
  }).keepLatest(),

  actions: {
    async select(selectedAddress){
      this.onSelect(selectedAddress);
      this.set('_address', selectedAddress);
    }
  }
});
