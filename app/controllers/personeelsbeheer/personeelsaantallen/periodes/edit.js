import Controller from '@ember/controller';
import { task, keepLatestTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

export default class PersoneelsbeheerPersoneelsaantallenPeriodesEditController extends Controller {
  @tracked dataset;

  get isFTEDataset() {
    const subjects = this.dataset.hasMany('subjects').value();

    return subjects?.find((um) => um.isFTE);
  }

  get isSaving() {
    return this.save.isRunning || this.updateModifiedDate.isRunning;
  }

  get wasUpdatedThisYear() {
    const modified = this.dataset.modified;
    if (!modified) {
      return false;
    }

    const today = new Date();
    return today.getFullYear() === modified.getFullYear();
  }

  queueSave = keepLatestTask(async () => {
    await timeout(3000);
    await this.save.perform();
  });

  save = task(async () => {
    const dirtyObservations = this.model.filter(
      (obs) => obs.hasDirtyAttributes,
    );

    if (dirtyObservations.length) {
      await Promise.all(dirtyObservations.map((obs) => obs.save()));
      await this.updateModifiedDate.unlinked().perform();
    }
  });

  updateModifiedDate = task(async () => {
    this.dataset.modified = new Date();
    await this.dataset.save();
  });
}
