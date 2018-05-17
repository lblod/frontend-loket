import Component from '@ember/component';

export default Component.extend({
  didReceiveAttrs() {
    this._super(...arguments);
    if (this.get('model')) {
      const value = this.get(`solution.${this.get('model.identifier')}`);
      this.set('value', value);
    }
  },
  actions: {
    editSolution() {
      const prop = this.get('model.identifier');
      this.set(`solution.${prop}`, !this.get('value'));
    }
  }
});
