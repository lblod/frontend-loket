import Controller from '@ember/controller';
import { notEqual, or } from 'ember-awesome-macros';
import { task } from 'ember-concurrency';

export default Controller.extend({
  statusIsDirty: notEqual('initialStatus.id', 'model.status.id'),
  isDirty: or('model.hasDirtyAttributes', 'statusIsDirty'),

  save: task(function * () {
    yield this.model.save();
    this.exit();
  }),

  exit() {
    this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen');
  },

  actions: {
    cancel(){
      this.exit();
    },

    async resetChanges() {
      this.model.rollbackAttributes();
      const status = await this.initialStatus;
      this.model.set('status', status),
      this.exit();
    }
  }
});
