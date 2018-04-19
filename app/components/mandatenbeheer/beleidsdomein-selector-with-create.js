import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { A } from '@ember/array';

export default Component.extend({
  store: service(),

  init(){
    this._super(...arguments);
    this.set('beleidsdomeinen', A());
  },

  searchByName: task(function* (searchData) {
    yield timeout(300);
    let queryParams = {
      sort:'label',
      'filter[label]': searchData
    };
    return yield this.get('store').query('beleidsdomein-code', queryParams);
  }),

  actions: {
    select(beleidsdomeinen){
      this.set('beleidsdomeinen', beleidsdomeinen);
      this.get('onSelect')(beleidsdomeinen);
    },
    create(beleidsdomein){
      this.get('beleidsdomeinen').
        pushObject(this.get('store').createRecord('beleidsdomein-code', {label: beleidsdomein}));
      this.get('onSelect')(this.get('beleidsdomeinen'));
    },
    suggest(term) {
      return `Voeg "${term}" toe`;
    }
  }
});
