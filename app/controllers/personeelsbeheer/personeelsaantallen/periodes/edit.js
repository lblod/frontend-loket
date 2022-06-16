import Controller from '@ember/controller';
import { task, keepLatestTask, all, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

export default class PersoneelsbeheerPersoneelsaantallenPeriodesEditController extends Controller {
  @tracked dataset;

  get isFTEDataset() {
    return (
      this.dataset.subjects && this.dataset.subjects.find((um) => um.isFTE)
    );
  }

  @keepLatestTask
  *queueSave() {
    yield timeout(3000);
    yield this.save.perform();
  }

  @task
  *save() {
    const dirtyObservations = this.model.filter(
      (obs) => obs.hasDirtyAttributes
    );

    if (dirtyObservations.length) {
      yield all(dirtyObservations.map((obs) => obs.save()));
      this.dataset.set('modified', new Date());
      yield this.dataset.save();
    }
  }
}
