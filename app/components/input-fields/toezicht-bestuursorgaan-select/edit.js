import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  currentSession: service(),
  store: service(),

  allowClear: true,
  disabled: false,
  displayProperty: 'classificatie.label',

  async didReceiveAttrs(){
    this._super(...arguments);

    if (this.get('model')) {
      const value = this.get(`solution.${this.get('model.identifier')}`);
      this.set('object_instance', value);
    }
  },

  search: task(function* (searchData){
    yield timeout(300);

    let bestuurseenheid = yield this.get('currentSession.group');
    let queryParams = {
      sort: 'classificatie.label',
      include: 'classificatie',
      'filter[classificatie]': searchData,
      'filter[bestuurseenheid][id]': bestuurseenheid.get('id')
    };

    return yield this.get('store').query('bestuursorgaan', queryParams);
  }),

  actions: {
    select(object_instance){
      this.set('object_instance', object_instance);
      const prop = this.get('model.identifier');
      this.set(`solution.${prop}`, object_instance);
    }
  }

});
