import DS from 'ember-data';
import { belongsTo } from 'ember-data/relationships';
import { alias } from '@ember/object/computed';

export default DS.Model.extend({
  address: DS.attr(),
  replicatedFile: belongsTo('file', { inverse: null }),

  downloadLink: alias('replicatedFile.downloadLink')
});