import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { equal } from '@ember/object/computed';
import { and, not } from 'ember-awesome-macros';
import { documentStatusVerstuurdId } from '../../../models/document-status';

export default Controller.extend({
  store: service(),
  currentSession: service(),
  readyToSend: equal('model.files.length', 2),
  enableUpload: and('model.status.isConcept', not('readyToSend')),
  async updateModel() {
    const currentUser = await this.get('currentSession.currentUser');
    this.model.set('lastModifiedBy', currentUser);
    this.model.set('modified', new Date());
    return this.model.save();
  },
  actions: {
    async send() {
      const statusSent = await this.store.findRecord('document-status', documentStatusVerstuurdId);
      this.model.set('status', statusSent);
      await this.updateModel();
      this.transitionToRoute('bbcdr.rapporten.index');
    },
    async deleteReport() {
      const files = await this.model.files;
      files.forEach(file => file.destroyRecord());
      this.model.destroyRecord();
      this.transitionToRoute('bbcdr.rapporten.index');
    },
    async addFile(file) {
      this.model.files.pushObject(file);
      await this.updateModel();
    },
    async deleteFile(file) {
      this.model.files.removeObject(file);
      await this.updateModel();
      file.destroyRecord();
    }
  }
});
