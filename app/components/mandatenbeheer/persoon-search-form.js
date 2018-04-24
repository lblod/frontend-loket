import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export default Component.extend({
  store: service(),
  hasSearched: false,
  noResultsAfterSearch: computed('personen', 'search.isRunning', function(){
    if(this.get('search.isRunning'))
      return false;
    return this.get('hasSearched') && this.get('personen').length === 0;
  }),
  searchTerms: computed('gebruikteVoornaam', 'achternaam', 'identificator', function(){
    return [this.get('gebruikteVoornaam'), this.get('achternaam'), this.get('identificator')].filter( t => t ).join(', ');
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
      filter:{
        achternaam: this.get('achternaam') || undefined,
        'gebruikte-voornaam': this.get('gebruikteVoornaam') || undefined,
        identifcator: this.get('identificator') || undefined
      }
    };
    this.set('personen', yield this.get('store').query('persoon', queryParams));
  }),

  actions: {
    selectPersoon(persoon){
      this.get('onSelect')(persoon);
    },
    cancel(){
      this.get('onCancel')();
    }
  }
});
