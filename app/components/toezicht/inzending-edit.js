import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['col--4-12 col--9-12--m col--12-12--s container-flex--contain'],
  router: service(),
  store: service(),
  currentSession: service(),
  files: null,

  canDelete: computed('isNew', 'model.inzendingVoorToezicht.status.id', function(){
    return !this.get('isNew') && !this.model.get('inzendingVoorToezicht.isVerstuurd');
  }),

  async updateInzending(){
    this.model.set('inzendingVoorToezicht.modified', new Date());
    this.model.get('inzendingVoorToezicht.files').setObjects(this.files);
    this.model.set('inzendingVoorToezicht.lastModifier', await this.currentSession.get('user'));
    return this.model.save();
  },

  init() {
    this._super(...arguments);
    this.set('files', A());
  },

  async didReceiveAttrs(){
    this._super(...arguments);
    let inzending = await this.model.get('inzendingVoorToezicht');
    this.set('inzending', inzending);
    let files = await inzending.get('files');
    if(files)
      this.files.setObjects(files.toArray());
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
    async create(){
      const solution = await this.get('dynamicForm').save();
      await this.updateInzending();
      this.get('router').transitionTo('toezicht.inzendingen.edit', this.model.get('inzendingVoorToezicht.id'));
    },
    async send(){
      await this.get('dynamicForm').save();
      const statusSent = (await this.store.query('document-status', {
        filter: { ':uri:': 'http://data.lblod.info/document-statuses/verstuurd' }
      })).firstObject;
      this.model.set('inzendingVoorToezicht.status', statusSent);
      await this.updateInzending();
      this.get('router').transitionTo('toezicht.inzendingen.index');
    },
    async delete(){
      let files = await this.model.get('inzendingVoorToezicht.files');
      await (await this.model.get('inzendingVoorToezicht')).destroyRecord();
      await Promise.all(files.map(f => f.destroyRecord()));
      await this.model.destroyRecord();
      this.get('router').transitionTo('toezicht.inzendingen.index');
    },
    async addFile(file) {
      this.files.pushObject(file);
    },
    async deleteFile(file) {
      this.files.removeObject(file);
    }
  }
});
