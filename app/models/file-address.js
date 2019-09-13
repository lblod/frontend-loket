import DS from 'ember-data';
import { belongsTo } from 'ember-data/relationships';
import { computed } from '@ember/object';

export default DS.Model.extend({
  address: DS.attr(),
  replicatedFile: belongsTo('file', { inverse: null }),

  isValidAddress: computed('address', function() {
    return this.address && this.address.match(/^(http|ftp)s?:\/\/[\w\.]+\.\w+\/.*/);
  })
});
