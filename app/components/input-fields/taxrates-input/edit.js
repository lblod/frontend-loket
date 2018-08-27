import { computed } from '@ember/object';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import InputField from '@lblod/ember-mu-dynamic-forms/mixins/input-field';

export default Component.extend( InputField, {
  store: service(),
  didReceiveAttrs() {
    this._super(...arguments);
    this.set('taxRates', A());
    if (this.get('model')) {
      const value = this.get(`solution.${this.get('model.identifier')}`);
      this.set('taxRates', value || A());
    }
  },

  activeInputStates: computed( 'inputStates.[]', 'value', function() {
    const inputStates = this.inputStates;

    return inputStates
      .map(function( inputState ) {
        // Yield state name for matching validations
        switch (inputState.validationName) {
          case "empty":
            return this.taxRates && this.taxRates.length == 0 && inputState.stateName;
          default:
            return undefined;
        }})
      // remove all non-truethy validation names
      .filter( (i) => i );
  } ),

  actions: {
    async create(){
      let taxRate =this.get('store').createRecord('tax-rate');
      await taxRate.save();
      this.taxRates.pushObject(taxRate);
    },

    async delete(taxRate){
      this.taxRates.removeObject(taxRate);
      await taxRate.destroy();
    }
  }
});
