import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  currentSession: service(),
  store: service(),

  allowClear: true,
  disabled: false,
  displayProperty: 'classificatie.label',

  async init() {
    this._super(...arguments);

    const options = await this.search.perform();
    this.set('options', options);
  },

  async didReceiveAttrs(){
    this._super(...arguments);

    if (this.get('model')) {
      let value = await this.get(`solution.${this.get('model.identifier')}`);

      if (value && value.get('isNew')) { // only already existing options are allowed
        value.destroyRecord();
        value = null;
      }

      this.set('object_instance', value);
    }
  },

  search: task(function* (searchData){
    yield timeout(300);

    const bestuurseenheid = yield this.get('currentSession.group');
    const queryParams = {
      sort: 'classificatie.label',
      include: 'classificatie',
      'filter[bestuurseenheid][id]': bestuurseenheid.get('id')
    };

    if (searchData)
      queryParams['filter[classificatie]'] = searchData;

    const resources = yield this.get('store').query('bestuursorgaan', queryParams);
    return resources;
  }),

  actions: {
    select(object_instance){
      this.set('object_instance', object_instance);
      const prop = this.get('model.identifier');
      this.set(`solution.${prop}`, object_instance);
    }
  }

});
