import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';

export default Component.extend({
  classNames: ['col--4-12 col--9-12--m col--12-12--s container-flex--contain'],
  router: service(),
  currentSession: service(),
  files: null,

  async updateInzending(){
    this.model.set('inzendingVoorToezicht.modified', new Date());
    this.model.set('inzendingVoorToezicht.files', this.files);
    this.model.set('inzendingVoorToezicht.lastModifier', await this.currentSession.get('user'));
    return this.model.save();
  },

  init() {
    this._super(...arguments);
    this.set('files', A());
  },

  didReceiveAttrs(){
    this._super(...arguments);
    this.set('inzending', this.model.get('inzendingVoorToezicht'));
  },

  actions: {
    async initDynamicForm(dForm){
      this.set('dynamicForm', dForm);
    },
    async close(){
      this.get('router').transitionTo('toezicht.inzendingen.index');
    },
    async save(){
      const solution = await this.get('dynamicForm').save();
      await this.updateInzending();
    },
    async addFile(file) {
      this.files.pushObject(file);
    },
    async deleteFile(file) {
      this.files.removeObject(file);
    }
  }
});
