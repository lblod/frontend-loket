import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ["upload__files upload__files--has-files"],
  active: true,

  actions: {
    delete(){
      this.get('onDelete')(this.get('file'));
    }
  }
});
