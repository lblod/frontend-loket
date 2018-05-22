import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';

export default Component.extend({
  classNames: ['col--4-12 col--9-12--m col--12-12--s container-flex--contain'],
  router: service(),
  files: null,
  init() {
    this._super(...arguments);
    this.set('files',A());
  },

  actions: {
    async initDynamicForm(dForm){
      this.set('dynamicForm', dForm);
    },
    async close(){
      this.get('router').transitionTo('toezicht.inzendingen.index');
    },
    async save(){
      const model = await this.get('dynamicForm').save();
      model.set('files', this.files);
      model.save();
    },
    async addFile(file) {
      this.files.pushObject(file);
    },
    async deleteFile(file) {
      this.files.removeObject(file);
    }
  }
});
