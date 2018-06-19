import Component from '@ember/component';

export default Component.extend({
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
