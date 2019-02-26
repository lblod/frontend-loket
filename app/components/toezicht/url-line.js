import Component from '@ember/component';
import { task } from 'ember-concurrency';

export default Component.extend({

  init() {
    this._super(...arguments);
    this.set('downloadLink', null);
  },

  async didReceiveAttrs() {
    this._super(...arguments);
    this.get('getDownloadLink').perform();
  },

  getDownloadLink: task(function* () {
    const cr = yield this.url.get('cacheResource');
    if (cr) {
      const link = `/files/${cr.get('id')}/download?name=${cr.get('filename')}`;
      this.set('downloadLink', link);
    }
  }),
});
