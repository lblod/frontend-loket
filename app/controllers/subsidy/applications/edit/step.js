import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { timeout } from 'ember-concurrency';
import { dropTask, task } from 'ember-concurrency-decorators';

export default class SubsidyApplicationsEditStepController extends Controller {
  @service currentSession;

  @tracked error;
  @tracked recentlySaved = false;
  @tracked isValidForm = true;

  get consumption() {
    return this.model.consumption;
  }

  get step() {
    return this.model.step;
  }

  @dropTask
  * save() {
    try {
      // TODO: implement form saving logic
      yield timeout(2000);
      yield this.updateConsumptionModifierData();
      this.updateRecentlySaved.perform();
    } catch (exception) {
      this.error = {
        message: 'Het lijkt er op dat er iets onverwacht is fout gelopen bij het bewaren van het formulier.',
        exception
      };
    }
  }

  @dropTask
  * submit() {
    try {
      // TODO: implement form submit logic
      yield timeout(2000);

      yield this.updateConsumptionModifierData();
    } catch (exception) {
      this.error = {
        message: 'Het lijkt er op dat er iets onverwacht is fout gelopen bij het verzenden van het formulier.',
        exception
      };
    }
  }

  @task
  * updateRecentlySaved() {
    this.recentlySaved = true;
    yield timeout(3000);
    this.recentlySaved = false;
  }

  async updateConsumptionModifierData() {
    this.consumption.modified = new Date();

    let currentUser = await this.currentSession.userContent;
    this.consumption.lastModifier = currentUser;

    await this.consumption.save();
  }

  reset() {
    this.error = null;
    this.recentlySaved = false;
  }
}
