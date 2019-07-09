import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import fetch from 'fetch';

const emptyAdresRegister = {
  land: null, //seriously no land?
  gemeente: null,
  postcode: null,
  adres: null,
  adresRegisterId: null,
  adresRegisterUri: null
}

export default Component.extend({

  async didReceiveAttrs(){
    if(await this.adres) {
      this.set('_address', { volledigAdres : { geografischeNaam : { spelling: this.adres.get('volledigAdres') } } });
    }
  },

  search: task(function* (searchData) {
    yield timeout(400);
    let result =  yield fetch(`/adressenregister/search?query=${searchData}`);
    if (result.ok){
      let addresses = yield result.json();
      return addresses['adressen'];
    }
    return [];
  }).keepLatest(),

  getDetailForOverviewItem: task(function* (overviewAddress){
    //the api returns only a 'summary', we need to fetch details.
    this.set('_address', null);

    if (overviewAddress) {
      let result =  yield fetch(`/adressenregister/detail?uri=${overviewAddress.detail}`);
      if (result.ok){
        let adresRegister = yield result.json();
        this.set('_address', adresRegister);
        this.onSelect(this.extractRelevantInfo(adresRegister));
      }
    } else {
      this.onSelect(emptyAdresRegister);
    }
  }),

  extractRelevantInfo(adresRegister){
    return {
      land: null, //seriously no land?
      // And also adding house number etc etc
      gemeente: adresRegister['gemeente']['gemeentenaam']['geografischeNaam']['spelling'],
      postcode: adresRegister['postinfo']['objectId'],
      volledigAdres: adresRegister['volledigAdres']['geografischeNaam']['spelling'],
      adresRegisterId: adresRegister['identificator']['objectId'],
      adresRegisterUri: adresRegister['identificator']['id']
    };
  },

  actions: {
    async select(overviewAddress){
      await this.getDetailForOverviewItem.perform(overviewAddress);
    }
  }
});
