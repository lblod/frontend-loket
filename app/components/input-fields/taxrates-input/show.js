import Component from '@ember/component';
import { A } from '@ember/array';

export default Component.extend({
  didReceiveAttrs() {
    this._super(...arguments);
    this.set('taxRates', A());
    if (this.get('model')) {
      const value = this.get(`solution.${this.get('model.identifier')}`);
      this.set('taxRates', value || A());
    }
  }
});
