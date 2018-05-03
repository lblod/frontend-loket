import Component from '@ember/component';
import { computed } from '@ember/object';
import humanReadableSize from '../../utils/human-readable-bytesize';

export default Component.extend({
  classNames: ["upload__files upload__files--has-files"],
  active: true,

  fileSize: computed('file', function(){
    let size = humanReadableSize(this.get('file.size'));
    return `(${size})`;
  }),

  actions: {
    delete(){
      this.get('onDelete')(this.get('file'));
    }
  }
});
