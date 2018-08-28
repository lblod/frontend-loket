import Component from '@ember/component';
import InputField from '@lblod/ember-mu-dynamic-forms/mixins/input-field';
import { oneWay } from '@ember/object/computed';

export default Component.extend( InputField, {
  disabled: false,
  internalValue: oneWay('value'),
  displayProperty: 'classificatie.label'
});
