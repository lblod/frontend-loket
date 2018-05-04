import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { computed } from '@ember/object';

export default Model.extend({
  filename: attr(),
  format: attr(),
  size: attr(),
  extension: attr('string', {defaultValue: 'n/a'}),
  created: attr('datetime'),
  humanReadableSize: computed('size', function(){
    //ripped from https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
    let bytes = this.get('size');
    let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  }),

  miniatureMetadata: computed('sizeMb', 'extension', function() {
    return `${this.extension} - ${this.humanReadableSize}`;
  })
});
