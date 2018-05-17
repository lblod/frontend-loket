import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  store: service(),

  //TODO parse these options
  allowClear: true,
  disabled: false,

  queryParamsBuilder: function (searchString){
    return {
      sort: 'label',
      'filter[label]': searchString
    };
  },

  async didReceiveAttrs(){
    this._super(...arguments);
    let options = this.get('model.options');
    this.set('queryModel', options.queryModel);
    this.set('displayProperty', options.displayProperty);

    //expects to define a function called queryParamsBuilder(searchString)
    let queryParamsBuilder = null;
    eval(options.queryParams);

    this.set('queryParams', queryParamsBuilder);

    if (this.get('model')) {
      //TODO assumes it is an object
      const value = this.get(`solution.${this.get('model.identifier')}`);
      this.set('object_instance', value);
    }
  },

  search: task(function* (searchData){
    yield timeout(300);
    return yield this.get('store').query(this.get('queryModel'), yield this.get('queryParams')(searchData));
  }),

  actions: {
    select(object_instance){
      this.set('object_instance', object_instance);
      const prop = this.get('model.identifier');
      this.set(`solution.${prop}`, object_instance);
    }
  }
});
