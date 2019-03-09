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
  formVersionTracker: service('toezicht/form-version-tracker'),
  currentSession: service(),
  files: null,
  addresses: null,
  fileAddresses: null,
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
    return !this.model.get('inzendingVoorToezicht.status.isVerstuurd') && (this.get('files.length') || !this.allEmptyFileAddresses);
  }),

  isWorking: computed('save.isRunning','delete.isRunning','send.isRunning', function(){
    return this.save.isRunning || this.delete.isRunning || this.send.isRunning || false;
  }),

  allEmptyFileAddresses: computed('fileAddresses', 'fileAddresses.[]', function(){
    return !(this.fileAddresses || []).any(a => a.address && a.address.length > 0);
  }),

  /**
   * url-box is used to either show existing urls or enter new ones
   * It is needed in two cases
   *  1. The inzending is not yet finalized/sent: !isSent
   *  2. The inzending has been sent and it contains at least one url: fileAddress.length > 0
   */
  needsUrlBox: computed('isSent', 'fileAddresses.length', function() {
    const notSent = !this.isSent;
    const hasFileAddresses = this.get('fileAddresses.length') > 0;
    return notSent || hasFileAddresses;
  }),

  async validate(){
    let errors = [];
    let states = await this.get('dynamicForm.formNode.unionStates');
    if(states.filter((s) => { return s == 'noSend'; }).length > 0)
      errors.push('Gelieve alle verplichte velden in te vullen.');

    if((await this.files).length == 0 && this.allEmptyFileAddresses)
      errors.push('Gelieve minstens één bestand of link naar document op te laden.');

    this.set('errorMsg', errors.join(' '));
  },

  async updateInzending(){
    let inzending = await this.model.get('inzendingVoorToezicht');
    inzending.set('modified', new Date());
    (await inzending.get('files')).setObjects(this.files);

    await Promise.all(this.fileAddresses.map(a => a.save()));
    (await inzending.get('fileAddresses')).setObjects(this.fileAddresses);

    inzending.set('lastModifier', await this.currentSession.get('user'));
    return inzending.save();
  },

  init() {
    this._super(...arguments);
    this.set('files', A());
    this.set('fileAddresses', A([]));
  },

  async didReceiveAttrs(){
    try {
      this._super(...arguments);
      let inzending = await this.model.get('inzendingVoorToezicht');
      this.set('inzending', inzending);
      let files = await inzending.get('files');
      if(files)
        this.files.setObjects(files.toArray());
      let fileAddresses = await inzending.get('fileAddresses');
      if(fileAddresses)
        this.fileAddresses.setObjects(fileAddresses.toArray());
    }
    catch(e){
      this.set('errorMsg', `Fout bij het inladen: ${e.message}. Gelieve opnieuw te proberen.`);
    }
  },

  save: task(function* (){
    try {
      yield this.dynamicForm.save();
      yield this.updateInzending();
    }
    catch(e){
      this.set('errorMsg', `Fout bij het opslaan: ${e.message}`);
    }
  }).drop(),

  send: task(function* (){
    try {
      yield this.dynamicForm.save();
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
    setFormVersion(formVersion){
      this.set('model.formNode', formVersion.get('formNode'));
      this.formVersionTracker.updateFomVersion(formVersion);
    },

    async initDynamicForm(dForm){
      this.set('dynamicForm', dForm);
    },
    async close(){
      this.router.transitionTo('toezicht.inzendingen.index');
    },
    async save(){
      this.flushErrors();
      await this.save.perform();
    },
    async create(){
      this.flushErrors();
      await this.save.perform();
      if(this.hasError) return;
      this.router.transitionTo('toezicht.inzendingen.edit', this.model.get('inzendingVoorToezicht.id'));
    },
    async send(){
      this.flushErrors();
      await this.validate();
      if(this.hasError) return;
      await this.save.perform();
      await this.send.perform();
      if(this.hasError) return;
      this.router.transitionTo('toezicht.inzendingen.index');
    },
    async deleteInzending(){
      this.flushErrors();
      this.set('deleteModal', true);
    },
    async confirmDelete(){
      this.set('deleteModal', false);
      await this.delete.perform();
      if(this.hasError) return;
      this.router.transitionTo('toezicht.inzendingen.index');
    },
    async cancelDelete(){
      this.set('deleteModal', false);
    },
    async addFile(file) {
      this.files.pushObject(file);
    },
    async deleteFile(file) {
      this.files.removeObject(file);
    },

    deleteFileAddress(fileAddress){
      this.fileAddresses.removeObject(fileAddress);
    }
  }
});
