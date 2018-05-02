import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';

export default Controller.extend({
  store: service(),
  init() {
    this._super(...arguments);
    this.set('files', A());
  },
  actions: {
    addFile(file) {
      this.get('files').pushObject(file);
    },
    async save() {
      try {
        const record = this.get('store').createRecord('bbcdr-report', {
          files: this.get('files')
        });
        await record.save();
        this.transitionToRoute('bbcdr.rapporten.edit', record.get('id'));
      }
      catch(e) {
        console.log(e);
      }
    }
  }
});
