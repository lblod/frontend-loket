import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';

export default class SubsidyApplicationsEditController extends Controller {
  @service router;

  get consumption() {
    return this.model;
  }

  @task
  *deleteConsumption() {
    try {
      yield this.consumption.destroyRecord();
      this.router.transitionTo('subsidy.applications');
    } catch (error) {
      // TODO Error handling
    }
  }
}
