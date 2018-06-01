import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  store: service(),
  currentSession: service(),
  
  async didReceiveAttrs(){
    this.set('_fractie', this.get('fractie'));
    this.set('bestuurseenheid', await this.get('currentSession.group'));
  },

  searchByName: task(function* (searchData) {
    yield timeout(300);
    let queryParams = {
      sort:'naam',
      filter: {
        naam: searchData,
        bestuurseenheid: {
          id: this.get('bestuurseenheid.id')
        }
      }
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
