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

  save = task(async () => {
    await this.model.save();
    this.exit();
  });

  resetChanges = task(async () => {
    if (this.isDirty) {
      this.model.rollbackAttributes();
      const status = await this.initialStatus;
      this.model.set('status', status);
    }
    this.exit();
  });

  exit() {
    this.router.transitionTo(
      'leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen',
    );
  }
}
