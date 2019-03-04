import Component from '@ember/component';

export default Component.extend({
  downloadLink: null,

  async didReceiveAttrs() {
    this._super(...arguments);
    this.getDownloadLink();
  },

  getDownloadLink: async function () {
    try {
      const cr = await this.url.get('cacheResource');
      if (cr) {
        const link = `/files/${cr.get('id')}/download?name=${cr.get('filename')}`;
        this.set('downloadLink', link);
      }
    } catch (err) {
      // no or bad url object is provided
    }
  },
});
