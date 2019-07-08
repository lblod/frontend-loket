import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { and, gte, not, or } from 'ember-awesome-macros';

export default Component.extend({
  classNames: ['col--10-12 col--9-12--m col--12-12--s container-flex--contain'],
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

  inzending: alias('model.inzendingVoorToezicht'),
  isSent: alias('model.inzendingVoorToezicht.status.isVerstuurd'),
  canSave: not('isSent'),
  canDelete: and(not('model.isNew'), 'canSave'),
  canSend: and('canSave', or('files.length', not('allEmptyFileAddresses'))),
  isWorking: or('save.isRunning', 'delete.isRunning', 'send.isRunning'),

  allEmptyFileAddresses: computed('fileAddresses', 'fileAddresses.{[],@each.address}', function() {
    return !(this.fileAddresses || []).any(a => a.address && a.address.length > 0);
  }),

  needsUrlBox: computed('isSent', 'fileAddresses.length', function() {
    return !this.isSent || this.get('fileAddresses.length') > 0;
  }),

  invalidFileAddresses: computed('fileAddresses.@each.address', function() {
    return this.fileAddresses.filter(fileAddress => {
      try {
        new URL(fileAddress.address);
        return false;
      }
      catch(err) { return true }
    })
  }),

  flushErrors() {
    this.set('errorMsg', '');
  },

  init() {
    this._super(...arguments);
    this.set('files', A());
    this.set('fileAddresses', A([]));
  },

  async didReceiveAttrs() {
    try {
      this._super(...arguments);
      const files = await this.inzending.get('files');
      if (files)
        this.files.setObjects(files.toArray());
      const fileAddresses = await this.inzending.get('fileAddresses');
      if (fileAddresses)
        this.fileAddresses.setObjects(fileAddresses.toArray());
    } catch (e) {
      this.set('errorMsg', `Fout bij het inladen: ${e.message}. Gelieve opnieuw te proberen.`);
    }
  },

  updateInzendingAttachments: task(function*() {
    const inzending = yield this.inzending;
    inzending.set('modified', new Date());
    (yield inzending.get('files')).setObjects(this.files);

    // TODO add stricter validation on URLs
    this.fileAddresses.forEach(a => a.set('address', a.address && a.address.trim()));
    yield Promise.all(this.fileAddresses.map(a => a.save()));
    (yield inzending.get('fileAddresses')).setObjects(this.fileAddresses);

    const lastModifier = yield this.currentSession.get('user');
    inzending.set('lastModifier', lastModifier);
    return inzending.save();
  }),

  validate: task(function*() {
    this.flushErrors();
    const errors = [];
    const states = yield this.get('dynamicForm.formNode.unionStates');
    if (states.some(s => s == 'noSend'))
      errors.push('Gelieve alle verplichte velden in te vullen.');

    if ((yield this.files).length == 0 && this.allEmptyFileAddresses)
      errors.push('Gelieve minstens één bestand of link naar document op te laden.');

    this.invalidFileAddresses.forEach(fileAddress => {
        errors.push(`Ongeldige link: ${fileAddress.address}.`);
    });

    this.set('errorMsg', errors.join(' '));
  }),

  save: task(function*() {
    this.flushErrors();
    try {
      yield this.dynamicForm.save();
      yield this.updateInzendingAttachments.perform();
    } catch (e) {
      this.set('errorMsg', `Fout bij het opslaan: ${e.message}`);
    }
  }).drop(),

  sendInzending: task(function*() {
    try {
      yield this.save.perform();
      const statusSent = (yield this.store.query('document-status', {
        filter: {
          ':uri:': 'http://data.lblod.info/document-statuses/verstuurd'
        }
      })).firstObject;
      const inzending = yield this.inzending;
      inzending.set('status', statusSent);
      inzending.set('sentDate', new Date());
      yield inzending.save();
    } catch (e) {
      this.set('errorMsg', `Fout bij het verzenden: ${e.message}`);
    }
  }).drop(),

  delete: task(function*() {
    try {
      const files = yield this.model.get('inzendingVoorToezicht.files');
      yield(yield this.model.get('inzendingVoorToezicht')).destroyRecord();
      yield Promise.all(files.map(f => f.destroyRecord()));
      yield this.model.destroyRecord();
    } catch (e) {
      this.set('errorMsg', `Fout bij het verwijderen: ${e.message}`);
    }
  }).drop(),

  actions: {
    async setFormVersion(formVersion) {
      const formNode = await formVersion.get('formNode');
      this.set('model.formNode', formNode);
      this.formVersionTracker.updateFormVersion(formVersion);
    },

    async create() {
      await this.save.perform();
      if (this.hasError) return;
      this.router.transitionTo('toezicht.inzendingen.edit', this.model.get('inzendingVoorToezicht.id'));
    },

    async send() {
      await this.validate.perform();
      if (this.hasError) return;
      await this.sendInzending.perform();
      if (this.hasError) return;
      this.router.transitionTo('toezicht.inzendingen.index');
    },

    async confirmDelete() {
      this.flushErrors();
      this.set('deleteModal', false);
      await this.delete.perform();
      if (this.hasError) return;
      this.router.transitionTo('toezicht.inzendingen.index');
    },

    addFile(file) {
      this.files.pushObject(file);
    },

    deleteFile(file) {
      this.files.removeObject(file);
    },

    deleteFileAddress(fileAddress) {
      this.fileAddresses.removeObject(fileAddress);
    },

    close() {
      this.router.transitionTo('toezicht.inzendingen.index');
    }
  }
});
