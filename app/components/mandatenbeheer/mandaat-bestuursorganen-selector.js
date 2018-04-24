import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  store: service(),

  didReceiveAttrs(){
    this.set('_mandaat', this.get('mandaat'));
  },

  searchByBestuursfunctie: task(function* (searchData) {
    yield timeout(300);
    let queryParams = {
      sort:'bestuursfunctie.label',
      include: 'bestuursfunctie',
      'filter[bestuursfunctie]': searchData,
      'filter[bevat-in][id]': this.get('bestuursorganen').map(o => o.get('id')).join(',')
    };
    return yield this.get('store').query('mandaat', queryParams);
  }),

  actions: {
    select(mandaat){
      this.set('_mandaat', mandaat);
      this.get('onSelect')(mandaat);
    }
  }
});
