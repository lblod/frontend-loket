import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export default Component.extend({
  store: service(),
  hasSearched: false,
  pageSize: 20,
  tagName: '',
  noResultsAfterSearch: computed('personen', 'isQuerying', function(){
    if(this.isQuerying)
      return false;
    return this.hasSearched && this.get('personen.length') === 0;
  }),
  searchTerms: computed('gebruikteVoornaam', 'achternaam', 'identificator', function(){
    return [this.gebruikteVoornaam, this.achternaam, this.identificator].filter( t => t ).join(', ');
  }),
  isQuerying: computed('search.isRunning', 'getPersoon.isRunning', function(){
    return this.get('search.isRunning') || this.get('getPersoon.isRunning');
  }),

  init(){
    this._super(...arguments);
    this.set('personen', A());
  },

  search: task(function* () {
    this.set('hasSearched', true);
    yield timeout(300);

    if(!(this.achternaam || this.gebruikteVoornaam || this.identificator)){
      this.set('queryParams', {});
      this.set('personen', []);
      return;
    }

    let queryParams = {
      sort:'achternaam',
      include: ['geboorte',
                'identificator'].join(','),
      filter: {
        achternaam: this.achternaam || undefined,
        'gebruikte-voornaam': this.gebruikteVoornaam || undefined,
        identificator: this.identificator || undefined
      },
      page:{
        size: this.pageSize,
        number: 0
      }
    };
    this.set('queryParams', queryParams);
    this.set('personen', (yield this.getPersoon.perform(queryParams)));
  }).restartable(),

  getPersoon: task(function* (queryParams){
    try {
      return yield this.store.query('persoon', queryParams);
    }
    catch(e){
      this.set('error', true);
    }
  }),

  resetAfterError(){
    this.set('error', false);
    this.set('hasSearched', false);
  },

  actions: {
    async selectPage(page){
      this.set('page', page);
      let queryParams = this.queryParams;
      queryParams['page'] = {number: page};
      this.set('personen', await this.getPersoon.perform(queryParams));
    },
    selectPersoon(persoon){
      this.onSelect(persoon);
    },
    cancel(){
      this.onCancel();
    },
    toggleError(){
      this.resetAfterError();
    }
  }
});
