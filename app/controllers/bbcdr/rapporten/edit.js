import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { equal } from '@ember/object/computed';
import { and, not } from 'ember-awesome-macros';
import { documentStatusVerstuurdId } from '../../../models/document-status';

export default Controller.extend({
  store: service(),
  readyToSend: equal('model.files.length', 2),
  enableUpload: and('model.status.isConcept', not('readyToSend')),
  actions: {
    async send() {
      const statusSent = await this.store.findRecord('document-status', documentStatusVerstuurdId);
      this.model.set('status', statusSent);
      this.model.set('modified', new Date());
      await this.model.save();
      this.transitionToRoute('bbcdr.rapporten.index');
    },
    async deleteReport() {
      const files = await this.model.files;
      files.forEach(file => file.destroyRecord());
      this.model.destroyRecord();
      this.transitionToRoute('bbcdr.rapporten.index');
    },
    async deleteFile(file) {
      this.model.files.removeObject(file);
      this.model.set('modified', new Date());
      await this.model.save();
      file.destroyRecord();
    }
  }
});
