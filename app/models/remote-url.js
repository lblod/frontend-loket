import DS from 'ember-data';
import { computed } from '@ember/object';
const { Model, attr, belongsTo } = DS;

export default Model.extend({
  uri: attr(),
  address: attr(),
  created: attr('date'),
  modified: attr('date'),
  download: belongsTo('file', { inverse: null }),
  downloadStatus: attr(),
  creator: attr(),

  downloadLink: computed('filename', function () {
    return `/files/${this.id}/download`;
  })
});
