import Controller from '@ember/controller';
import { task, all } from 'ember-concurrency';
import { computed } from '@ember/object';

export default Controller.extend({
  isBusy: computed('save.isRunning', 'cancel.isRunning', function(){
    return this.save.isRunning || this.cancel.isRunning;
  }),

  isFTEDataset: computed('dataset.subjects.@each.id', function(){
    return this.dataset.subjects && this.dataset.subjects.find(um => um.isFTE);
  }),

  save: task(function * (){
    yield all(this.model.map(obs => {
      if (obs.hasDirtyAttributes)
        obs.save();
    }));

    this.dataset.set('modified', new Date());
    yield this.dataset.save();
  }),

  cancel: task(function *(){
    yield all(this.model.map(obs => obs.rollbackAttributes()));
  })
});
