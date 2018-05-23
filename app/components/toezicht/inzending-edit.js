import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';

export default Component.extend({
  classNames: ['col--4-12 col--9-12--m col--12-12--s container-flex--contain'],
  router: service(),
  store: service(),
  currentSession: service(),
  files: null,

  canDelete: computed('isNew', 'model.inzendingVoorToezicht.status.id', function(){
    return !this.get('isNew') && !this.model.get('inzendingVoorToezicht.status.isVerstuurd');
  }),

  canSend: computed('isNew', 'model.inzendingVoorToezicht.status.id', function(){
    return !this.get('isNew') && !this.model.get('inzendingVoorToezicht.status.isVerstuurd');
  }),

  isWorking: computed('save.isRunning','delete.isRunning','send.isRunning', function(){
    return this.save.isRunning || this.delete.isRunning || this.send.isRunning || false;
  }),

  async updateInzending(){
    let inzending = await this.model.get('inzendingVoorToezicht');
    inzending.set('modified', new Date());
    (await inzending.get('files')).setObjects(this.files);
    inzending.set('lastModifier', await this.currentSession.get('user'));
    return inzending.save();
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

  save: task(function* (){
      const solution = yield this.get('dynamicForm').save();
      yield this.updateInzending();
  }).drop(),

  send: task(function* (){
    yield this.get('dynamicForm').save();
    const statusSent = (yield this.store.query('document-status', {
        filter: { ':uri:': 'http://data.lblod.info/document-statuses/verstuurd' }
      })).firstObject;
    (yield this.model.get('inzendingVoorToezicht')).set('status', statusSent);
    yield this.updateInzending();
  }).drop(),

  delete: task(function* (){
     let files = yield this.model.get('inzendingVoorToezicht.files');
     yield (yield this.model.get('inzendingVoorToezicht')).destroyRecord();
     yield Promise.all(files.map(f => f.destroyRecord()));
     yield this.model.destroyRecord();
  }).drop(),

  actions: {
    async initDynamicForm(dForm){
      this.set('dynamicForm', dForm);
    },
    async close(){
      this.get('router').transitionTo('toezicht.inzendingen.index');
    },
    async save(){
      await this.save.perform();
    },
    async create(){
      await this.save.perform();
      this.get('router').transitionTo('toezicht.inzendingen.edit', this.model.get('inzendingVoorToezicht.id'));
    },
    async send(){
      await this.send.perform();
      this.get('router').transitionTo('toezicht.inzendingen.index');
    },
    async delete(){
      await this.delete.perform();
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
