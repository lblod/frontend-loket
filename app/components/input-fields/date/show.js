import Component from '@ember/component';

export default Component.extend({
  datePickerClass: 'date-picker-mandataris-edit',
  dateFormat: 'DD-MM-YYYY',
  didReceiveAttrs() {
    this._super(...arguments);
    if (this.get('model')) {
      const value = this.get(`solution.${this.get('model.identifier')}`);
      this.set('value', value);
    }
  }
});
