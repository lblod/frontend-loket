import Component from '@ember/component';

export default Component.extend({
  actions: {
    async removeFunctionaris(functionaris) {
      await functionaris.destroyRecord();
      const count = this.content.meta.count - 1;
      this.content.set('meta.count', count);
    }
  }
});
