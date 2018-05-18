import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  store: service(),

  //TODO parse these options
  allowClear: true,
  disabled: false,

  buildQueryParams(options){
    return ( searchString ) => {
      let filter = options.filter.queryParams;
      filter[options.filter.filterKey] = searchString;
      return filter;
    };
  },

  async didReceiveAttrs(){
    this._super(...arguments);
    let options = this.get('model.options');
    this.set('queryModel', options.queryModel);
    this.set('displayProperty', options.displayProperty);
    this.set('queryParams', this.buildQueryParams(options));

    if (this.get('model')) {
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
