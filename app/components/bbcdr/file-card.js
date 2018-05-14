import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ["upload__files upload__files--has-files"],
  active: true,

  downloadLink: computed('file', function(){
    return `/files/${this.file.get('id')}/download?name=${this.file.get('filename')}`;
  }),

  actions: {
    delete(){
      this.get('onDelete')(this.get('file'));
    }
  }
});
