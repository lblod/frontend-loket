import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';

export default Component.extend({
  store: service(),
  didReceiveAttrs() {
    this._super(...arguments);
    this.set('taxRates', A());
    if (this.get('model')) {
      const value = this.get(`solution.${this.get('model.identifier')}`);
      this.set('taxRates', value || A());
    }
  },

  actions: {
    create(){
      let taxRate =this.get('store').createRecord('tax-rate');
      this.taxRates.pushObject(taxRate);
    },

    delete(taxRate){
      this.taxRates.removeObject(taxRate);
      taxRate.destroy();
    }
  }
});
