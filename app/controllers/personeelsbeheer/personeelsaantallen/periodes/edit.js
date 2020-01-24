import Controller from '@ember/controller';
import { task, all, timeout } from 'ember-concurrency';
import { computed } from '@ember/object';

export default Controller.extend({
  isBusy: computed('save.isRunning', 'cancel.isRunning', function() {
    return this.save.isRunning || this.cancel.isRunning;
  }),

  isFTEDataset: computed('dataset.subjects.@each.id', function() {
    return this.dataset.subjects && this.dataset.subjects.find(um => um.isFTE);
  }),

  save: task(function*() {
    yield timeout(3000);
    const dirtyObservations = this.model.filter(obs => obs.hasDirtyAttributes);

    this.set('isSaving', true);
    if (dirtyObservations.length) {
      yield all(dirtyObservations.map(obs => obs.save()));
      this.dataset.set('modified', new Date());
      yield this.dataset.save();
    }
    this.set('isSaving', false);
  }).keepLatest()
});
