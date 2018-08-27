import Component from '@ember/component';
import InputField from '@lblod/ember-mu-dynamic-forms/mixins/input-field';

export default Component.extend( InputField, {
  disabled: false,
  displayProperty: 'label',

  async didReceiveAttrs(){
    this._super(...arguments);

    if (this.get('model')) {
      const value = this.get(`solution.${this.get('model.identifier')}`);
      this.set('object_instance', value);
    }
  }
});
