import DS from 'ember-data';
import { belongsTo } from 'ember-data/relationships';
import { computed }  from '@ember/object';

export default DS.Model.extend({
  address: DS.attr(),
  replicatedFile: belongsTo('file', { inverse: null }),

  downloadLink: computed('replicatedFile.downloadLink', function() {
    return this.get('replicatedFile.downloadLink');
  })
});