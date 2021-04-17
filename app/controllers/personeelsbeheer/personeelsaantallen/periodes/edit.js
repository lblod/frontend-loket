import Controller from '@ember/controller';
import { keepLatestTask, all, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

export default class PersoneelsbeheerPersoneelsaantallenPeriodesEditController extends Controller {
  @tracked dataset;

  get isBusy() {
    return this.save.isRunning || this.cancel.isRunning;
  }

  get isFTEDataset() {
    return this.dataset.subjects && this.dataset.subjects.find(um => um.isFTE);
  }

  @keepLatestTask
  *save() {
    yield timeout(3000);
    const dirtyObservations = this.model.filter(obs => obs.hasDirtyAttributes);

    this.set('isSaving', true);
    if (dirtyObservations.length) {
      yield all(dirtyObservations.map(obs => obs.save()));
      this.dataset.set('modified', new Date());
      yield this.dataset.save();
    }
    this.set('isSaving', false);
  }
}
