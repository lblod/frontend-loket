import Component from '@ember/component';

export default Component.extend({
  actions: {
    async removeMandataris(mandataris) {
      await mandataris.destroyRecord();
      const count = this.content.meta.count - 1;
      this.content.set('meta.count', count);
    }
  }
});
