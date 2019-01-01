import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import InputField from '@lblod/ember-mu-dynamic-forms/mixins/input-field';
import { oneWay } from '@ember/object/computed';

export default Component.extend( InputField, {
  currentSession: service(),
  store: service(),
  internalValue: oneWay('value'),

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

    if (this.model) {
      if (this.internalValue && this.internalValue.get('isNew')) { // only already existing options are allowed
        this.internalValue.destroyRecord();
        this.updateValue( this.internalValue );
      }
    }
  },

  search: task(function* (searchData){
    if (searchData)
      yield timeout(300);

    const bestuurseenheid = yield this.get('currentSession.group');
    const queryParams = {
      sort: 'classificatie.label',
      page: { size: 200 },
      include: 'classificatie',
      'filter[bestuurseenheid][id]': bestuurseenheid.get('id')
    };

    if (searchData)
      queryParams['filter[classificatie]'] = searchData;

    const resources = yield this.store.query('bestuursorgaan', queryParams);
    return resources;
  }).keepLatest(),

  actions: {
    select(object_instance){
      this.updateValue( object_instance );
    }
  }

});
