import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import fetch from 'fetch';

export default class SubsidyApplicationsEditController extends Controller {

  @service router;

  get consumption() {
    return this.model.consumption;
  }

  get step() {
    return this.model.step;
  }

  @task
  * open() {
    let toBeOpened = confirm('Bent u zeker van dat u deze stap wilt (her)openen?');
    if (toBeOpened)
      try {
        yield fetch(`/flow-management/consumption/${this.consumption.id}/step/${this.step.order}/open`, {
          method: 'POST'
        });
        yield this.consumption.belongsTo('activeSubsidyApplicationFlowStep').reload();
        yield this.consumption.activeSubsidyApplicationFlowStep.reload();
        yield this.consumption.hasMany('subsidyApplicationForms').reload();
        yield Promise.all(
          this.consumption
              .subsidyApplicationForms
              .map(async (form) => await form.belongsTo('status').reload())
        );
        yield this.consumption.belongsTo('status').reload();
      } catch (error) {
        console.log('BOEM');
        console.error(error);
        // TODO Error handling
      }
  }
}
