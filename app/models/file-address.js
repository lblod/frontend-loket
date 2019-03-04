import DS from 'ember-data';
import { belongsTo } from 'ember-data/relationships';
import { computed }  from '@ember/object';

export default DS.Model.extend({
  address: DS.attr(),
  cacheResource: belongsTo('file', { inverse: null }),

  downloadLink: computed('cacheResource.{id,filename}', function() {
    const cacheResourceId = this.get('cacheResource.id');
    // TODO: as said in the PR: update the name cacheResource, it's disturbing :-)
    const filename = this.get('cacheResource.filename');
    const result =  cacheResourceId && filename && `/files/${cacheResourceId}/download?name=${filename}`;
    debugger;
    return result;
  })
});
