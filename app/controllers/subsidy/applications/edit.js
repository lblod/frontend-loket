import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import fetch from 'fetch';

export default class SubsidyApplicationsEditController extends Controller {
  @service router;

  get reeksHasStartOrEnd() {
    return (
      this.consumption.get(
        'subsidyApplicationFlow.subsidyMeasureOfferSeries.period.begin'
      ) ||
      this.consumption.get(
        'subsidyApplicationFlow.subsidyMeasureOfferSeries.period.end'
      )
    );
  }

  get consumption() {
    return this.model.consumption;
  }

  get organization() {
    return this.model.organization;
  }

  get canDelete() {
    return this.model.consumption.get('status.isConcept');
  }

  @task
  *delete() {
    if (!this.canDelete || !this.consumption.isStable) {
      return;
    }

    try {
      this.consumption.isStable = false;
      /**
       * NOTE: this endpoint prevents the removal of submitted forms, preventing the removal of a consumption all together.
       */
      const forms = yield this.consumption
        .get('subsidyApplicationForms')
        .toArray();
      for (const form of forms) {
        yield fetch(`/management-application-forms/${form.id}`, {
          method: 'DELETE',
        });
      }
      yield this.consumption.get('participations').invoke('destroyRecord');
      // We intentionally don't use 'destroyRecord` here since that calls unloadRecord before the
      // transition which causes issues in the ConsumptionStatusPill component
      this.consumption.deleteRecord();
      yield this.consumption.save();
      this.router.transitionTo('subsidy.applications');
      this.consumption.unloadRecord();
    } catch (error) {
      console.log('Removal of consumption failed because:');
      console.error(error);
      // TODO Error handling
    } finally {
      this.consumption.isStable = true;
    }
  }
}
