import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { A } from '@ember/array';

export default Component.extend({
  store: service(),

  init(){
    this._super(...arguments);
    this.set('_beleidsdomeinen', A());
  },

  didReceiveAttrs(){
    this.set('_beleidsdomeinen', this.get('beleidsdomeinen') || A());
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
      this.set('_beleidsdomeinen', beleidsdomeinen);
      this.get('onSelect')(beleidsdomeinen);
    },
    async create(beleidsdomein){
      let domein = await this.get('store').createRecord('beleidsdomein-code', {label: beleidsdomein});
      this.get('_beleidsdomeinen').pushObject(domein);
      this.get('onSelect')(this.get('_beleidsdomeinen'));
    },
    suggest(term) {
      return `Voeg "${term}" toe`;
    }
  }
});
