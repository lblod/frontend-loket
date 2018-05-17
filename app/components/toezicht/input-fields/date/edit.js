import Component from '@ember/component';
import { observer } from '@ember/object';

export default Component.extend({
  //TODO: extract properties from options
  placeholder: '01-01-2019',
  datePickerClass: 'date-picker-mandataris-edit',
  dateFormat: 'DD-MM-YYYY',

  valueObserver: observer('value', function() {
     const prop = this.get('model.identifier');
     this.set(`solution.${prop}`, this.get('value'));
  }),

  didReceiveAttrs() {
    this._super(...arguments);
    if (this.get('model')) {
      const value = this.get(`solution.${this.get('model.identifier')}`);
      this.set('value', value);
    }
  }
});
