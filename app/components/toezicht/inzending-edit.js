import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { and, gte, not, or } from 'ember-awesome-macros';

export default Component.extend({
  classNames: ['col--10-12 col--9-12--m col--12-12--s container-flex--contain'],
  router: service(),
  store: service(),
  currentSession: service(),
  errorMsg: '',
  hasError: gte('errorMsg.length', 1),
  deleteModal: false,

  inzending: alias('model.inzendingVoorToezicht'),
  isSent: alias('model.inzendingVoorToezicht.status.isVerstuurd'),
  canSave: not('isSent'),
  canDelete: and(not('model.isNew'), 'canSave'),
  isWorking: or('save.isRunning', 'delete.isRunning', 'send.isRunning'),

  flushErrors() {
    this.set('errorMsg', '');
  },

  updateInzendingAttachments: task(function*() {
    const inzending = yield this.inzending;
    inzending.set('modified', new Date());

    const lastModifier = yield this.currentSession.get('user');
    inzending.set('lastModifier', lastModifier);
    return inzending.save();
  }),

  validate: task(function*() {
    this.flushErrors();
    const states = yield this.get('dynamicForm.formNode.unionStates');
    if (states.filter((s) => s == 'noSend').length)
      this.set('errorMsg', 'Gelieve alle verplichte velden in te vullen.');
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
      yield(yield this.model.get('inzendingVoorToezicht')).destroyRecord();
      yield this.model.destroyRecord();
    } catch (e) {
      this.set('errorMsg', `Fout bij het verwijderen: ${e.message}`);
    }
  }).drop(),

  actions: {
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

    close() {
      this.router.transitionTo('toezicht.inzendingen.index');
    }
  }
});
