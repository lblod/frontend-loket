import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  store: service(),

  searchByName: task(function* (searchData) {
    yield timeout(300);
    let queryParams = {
      sort:'gebruikte-voornaam',
      include: ['geboorte',
                'identificator'].join(','),
      //temporary workaround
      'filter[achternaam]': searchData
    };
    return yield this.get('store').query('persoon', queryParams);
  }),

  searchById: task(function* (searchData) {
    yield timeout(300);
    let queryParams = {
      sort:'gebruikte-voornaam',
      include: 'identificator',
      'filter[identificator]': searchData
    };
    return yield this.get('store').query('persoon', queryParams);
  }),

  actions: {
    selectPersoon(persoon){
      this.get('onSelect')(persoon);
    }
  }
});
