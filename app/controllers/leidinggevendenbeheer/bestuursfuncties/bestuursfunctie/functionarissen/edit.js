import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class LeidinggevendenbeheerBestuursfunctiesBestuursfunctieFunctionarissenEditController extends Controller {
  @service() router;

  @tracked initialStatus;

  get statusIsDirty() {
    return this.initialStatus.get('id') != this.model.status.get('id');
  }

  get isDirty() {
    return this.model.hasDirtyAttributes || this.statusIsDirty;
  }

  @task
  *save() {
    yield this.model.save();
    this.exit();
  }

  @task
  *resetChanges() {
    if (this.isDirty) {
      this.model.rollbackAttributes();
      const status = yield this.initialStatus;
      this.model.set('status', status);
    }
    this.exit();
  }

  exit() {
    this.router.transitionTo(
      'leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen'
    );
  }
}
