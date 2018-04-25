import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export default Component.extend({
  store: service(),
  hasSearched: false,
  pageSize: 20,
  noResultsAfterSearch: computed('personen', 'isQuerying', function(){
    if(this.get('isQuerying'))
      return false;
    return this.get('hasSearched') && this.get('personen.length') === 0;
  }),
  searchTerms: computed('gebruikteVoornaam', 'achternaam', 'identificator', function(){
    return [this.get('gebruikteVoornaam'), this.get('achternaam'), this.get('identificator')].filter( t => t ).join(', ');
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
    let queryParams = {
      sort:'achternaam',
      include: ['geboorte',
                'identificator'].join(','),
      filter: {
        achternaam: this.get('achternaam') || undefined,
        'gebruikte-voornaam': this.get('gebruikteVoornaam') || undefined,
        identifcator: this.get('identificator') || undefined
      },
      page:{
        size: this.get('pageSize')
      }
    };
    this.set('queryParams', queryParams);
    this.set('personen', yield this.getPersoon.perform(queryParams));
  }),

  getPersoon: task(function* (queryParams){
    try {
      return yield this.get('store').query('persoon', queryParams);
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
      let queryParams = this.get('queryParams');
      queryParams['page'] = {number: page};
      this.set('personen', await this.getPersoon.perform(queryParams));
    },
    selectPersoon(persoon){
      this.get('onSelect')(persoon);
    },
    cancel(){
      this.get('onCancel')();
    },
    toggleError(){
      this.resetAfterError();
    }
  }
});
