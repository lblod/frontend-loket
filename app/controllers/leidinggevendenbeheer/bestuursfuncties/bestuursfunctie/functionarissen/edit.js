import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

export default class LeidinggevendenbeheerBestuursfunctiesBestuursfunctieFunctionarissenEditController extends Controller {
  @tracked initialStatus;

  get statusIsDirty(){
    return this.initialStatus.get('id') != this.model.status.get('id');
  }

  get isDirty() {
    return this.model.hasDirtyAttributes || this.statusIsDirty;
  }

  @task(function * () {
    yield this.model.save();
    this.exit();
  }) save;

  @task(function * () {
    if (this.isDirty) {
      this.model.rollbackAttributes();
      const status = yield this.initialStatus;
      this.model.set('status', status);
    }
    this.exit();
  }) resetChanges;

  exit() {
    this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen');
  }
}
