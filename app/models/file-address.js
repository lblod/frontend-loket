import DS from 'ember-data';
import { belongsTo } from 'ember-data/relationships';
import { computed }  from '@ember/object';

export default DS.Model.extend({
  address: DS.attr(),
  replicatedFile: belongsTo('file', { inverse: null }),

  downloadLink: computed('replicatedFile.{id,filename}', function() {
    const replicatedFileId = this.get('replicatedFile.id');
    const filename = this.get('replicatedFile.filename');
    const result =  replicatedFileId && filename && `/files/${replicatedFileId}/download?name=${filename}`;
    return result;
  })
});
