import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import { computed } from '@ember/object';
import { gte } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  classNames: ['col--5-12 col--9-12--m col--12-12--s container-flex--contain'],
  router: service(),
  store: service(),
  currentSession: service(),
  files: null,
  errorMsg: '',
  hasError: gte('errorMsg.length', 1),
  deleteModal: false,

  flushErrors(){
    this.set('errorMsg', '');
  },

  isSent: computed('model.inzendingVoorToezicht.status.id', function(){
    return this.model.get('inzendingVoorToezicht.status.isVerstuurd');
  }),

  canSave: computed('model.inzendingVoorToezicht.status.id', function(){
    return !this.model.get('inzendingVoorToezicht.status.isVerstuurd');
  }),

  canDelete: computed('model.isNew', 'model.inzendingVoorToezicht.status.id', function(){
    return !this.get('model.isNew') && !this.model.get('inzendingVoorToezicht.status.isVerstuurd');
  }),

  canSend: computed('model.inzendingVoorToezicht.status.id', 'files.[]', function(){
    return !this.model.get('inzendingVoorToezicht.status.isVerstuurd') && this.get('files.length');
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
    try {
      this._super(...arguments);
      let inzending = await this.model.get('inzendingVoorToezicht');
      this.set('inzending', inzending);
      let files = await inzending.get('files');
      if(files)
        this.files.setObjects(files.toArray());
    }
    catch(e){
      this.set('errorMsg', `Fout bij het inladen: ${e.message}. Gelieve opnieuw te proberen.`);
    }
  },

  save: task(function* (){
    try {
      yield this.get('dynamicForm').save();
      yield this.updateInzending();
    }
    catch(e){
      this.set('errorMsg', `Fout bij het opslaan: ${e.message}`);
    }
  }).drop(),

  send: task(function* (){
    try {
      yield this.get('dynamicForm').save();
      const statusSent = (yield this.store.query('document-status', {
          filter: { ':uri:': 'http://data.lblod.info/document-statuses/verstuurd' }
      })).firstObject;
      let inzending = yield this.model.get('inzendingVoorToezicht');
      inzending.set('status', statusSent);
      inzending.set('sentDate', new Date());
      yield this.updateInzending();
    }
    catch(e){
      this.set('errorMsg', `Fout bij het verzenden: ${e.message}`);
    }
  }).drop(),

  delete: task(function* (){
    try {
      let files = yield this.model.get('inzendingVoorToezicht.files');
      yield (yield this.model.get('inzendingVoorToezicht')).destroyRecord();
      yield Promise.all(files.map(f => f.destroyRecord()));
      yield this.model.destroyRecord();
    }
    catch(e){
      this.set('errorMsg', `Fout bij het verwijderen: ${e.message}`);
    }
  }).drop(),

  actions: {
    async initDynamicForm(dForm){
      this.set('dynamicForm', dForm);
    },
    async close(){
      this.get('router').transitionTo('toezicht.inzendingen.index');
    },
    async save(){
      this.flushErrors();
      await this.save.perform();
    },
    async create(){
      this.flushErrors();
      await this.save.perform();
      if(this.hasError) return;
      this.get('router').transitionTo('toezicht.inzendingen.edit', this.model.get('inzendingVoorToezicht.id'));
    },
    async send(){
      this.flushErrors();
      await this.save.perform();
      await this.send.perform();
      if(this.hasError) return;
      this.get('router').transitionTo('toezicht.inzendingen.index');
    },
    async deleteInzending(){
      this.flushErrors();
      this.set('deleteModal', true);
    },
    async confirmDelete(){
      this.set('deleteModal', false);
      await this.delete.perform();
      if(this.hasError) return;
      this.get('router').transitionTo('toezicht.inzendingen.index');
    },
    async cancelDelete(){
      this.set('deleteModal', false);
    },
    async addFile(file) {
      this.files.pushObject(file);
    },
    async deleteFile(file) {
      this.files.removeObject(file);
    }
  }
});
