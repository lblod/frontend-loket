import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';
import InputField from '@lblod/ember-mu-dynamic-forms/mixins/input-field';

export default Component.extend( InputField, {
  datePickerClass: 'date-picker-mandataris-edit',
  dateFormat: 'DD-MM-YYYY',
  internalValue: oneWay('value')
});
