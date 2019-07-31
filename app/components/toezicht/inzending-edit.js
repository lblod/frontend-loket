import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { alias, notEmpty } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { and, not, or } from 'ember-awesome-macros';

export default Component.extend({
  classNames: ['col--10-12 col--9-12--m col--12-12--s container-flex--contain'],
  router: service(),
  store: service(),
  currentSession: service(),
  errorMsg: '',
  hasError: notEmpty('errorMsg'),
  deleteModal: false,

  inzending: alias('model.inzendingVoorToezicht'),
  isSent: alias('inzending.status.isVerstuurd'),
  canSave: not('isSent'),
  canSend: not('isSent'),
  canDelete: and(not('model.isNew'), 'canSave'),
  isWorking: or('create.isRunning', 'save.isRunning', 'send.isRunning', 'confirmDelete.isRunning'),

  flushErrors() {
    this.set('errorMsg', '');
  },

  validate: task(function*() {
    this.flushErrors();
    const states = yield this.get('dynamicForm.formNode.unionStates');
    if (states.filter((s) => s == 'noSend').length) {
      this.set('errorMsg', 'Gelieve alle verplichte velden in te vullen.');
    }
    else {
      const files = yield this.inzending.get('files');
      const fileAddresses = yield this.inzending.get('fileAddresses');
      if (files.length == 0 && fileAddresses.length == 0) {
        this.set('errorMsg', 'Gelieve minstens één bestand of URL toe te voegen.');
      }
    }
  }),

  create: task(function*() {
    yield this.save.perform();
    if (this.hasError) return;
    const inzending = yield this.inzending;
    this.router.transitionTo('toezicht.inzendingen.edit', inzending.get('id'));
  }),

  save: task(function*() {
    this.flushErrors();
    try {
      yield this.dynamicForm.save();
      const inzending = yield this.inzending;
      const lastModifier = yield this.currentSession.get('user');
      inzending.set('modified', new Date());
      inzending.set('lastModifier', lastModifier);
      yield inzending.save();
    } catch (e) {
      this.set('errorMsg', `Fout bij het opslaan: ${e.message}`);
    }
  }).drop(),

  send: task(function*() {
    yield this.validate.perform();
    if (this.hasError) return;
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
      this.router.transitionTo('toezicht.inzendingen.index');
    } catch (e) {
      this.set('errorMsg', `Fout bij het verzenden: ${e.message}`);
    }
  }),

  confirmDelete: task(function*() {
    this.flushErrors();
    this.set('deleteModal', false);
    try {
      yield(yield this.model.get('inzendingVoorToezicht')).destroyRecord();
      yield this.model.destroyRecord();
      this.router.transitionTo('toezicht.inzendingen.index');
    } catch (e) {
      this.set('errorMsg', `Fout bij het verwijderen: ${e.message}`);
    }
  }),

  actions: {
    close() {
      this.router.transitionTo('toezicht.inzendingen.index');
    }
  }
});
