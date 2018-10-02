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
    this.set('_beleidsdomeinen', (this.beleidsdomeinen || A()).toArray());
  },

  searchByName: task(function* (searchData) {
    yield timeout(300);
    let queryParams = {
      sort:'label',
      'filter[label]': searchData
    };
    return yield this.store.query('beleidsdomein-code', queryParams);
  }),

  actions: {
    select(beleidsdomeinen){
      this._beleidsdomeinen.setObjects(beleidsdomeinen);
      this.onSelect(this._beleidsdomeinen);
    },
    async create(beleidsdomein){
      let domein = await this.store.createRecord('beleidsdomein-code', {label: beleidsdomein});
      this._beleidsdomeinen.pushObject(domein);
      this.onSelect(this._beleidsdomeinen);
    },
    suggest(term) {
      return `Voeg "${term}" toe`;
    }
  }
});
