import DS from 'ember-data';
import { belongsTo } from 'ember-data/relationships';
import { computed } from '@ember/object';

export default DS.Model.extend({
  address: DS.attr(),
  replicatedFile: belongsTo('file', { inverse: null }),

  isValidAddress: computed('address', function() {
    try {
      const url = new URL(this.address);
      const supportedProtocols = ['http:', 'https:', 'ftp:', 'sftp:'];
      return supportedProtocols.includes(url.protocol);
    }
    catch(err) {
      return false;
    }
  })
});
