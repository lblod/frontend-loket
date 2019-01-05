import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';

export default Component.extend({
  store: service(),

  didReceiveAttrs() {
    this._super(...arguments);
    this.set('options', A());
    this.setOptions.perform();
  },

  setOptions: task(function* () {
    const queryParams = {
      'include': 'form-node'
    };

    const formVersions = yield this.store.findAll('inzending-voor-toezicht-form-version', queryParams);
    this.set('options', formVersions);
  }),

  actions: {
    select(data){
      this.set('_selected', data);
    },

    proceed(){
      this.onSelect(this._selected);
    }
  }

});
