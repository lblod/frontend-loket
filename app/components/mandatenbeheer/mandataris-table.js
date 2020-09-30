import Component from '@ember/component';
import fetch from 'fetch';

export default Component.extend({
  actions: {
    async removeMandataris(mandataris) {
      await fetch(`/mandataris-archive/${mandataris.id}/archive`, {
        method: 'POST'
      });
      await mandataris.destroyRecord();

      const count = this.content.meta.count - 1;
      this.content.set('meta.count', count);
    }
  }
});
