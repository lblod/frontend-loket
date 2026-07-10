import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { restartableTask, timeout } from 'ember-concurrency';
import { INVALIDATION_REASON } from 'frontend-loket/models/concept';

export default class EredienstMandatenbeheerMandatarissenController extends Controller {
  @service currentSession;
  @service router;
  @service store;

  queryParams = ['vendorId', 'active', 'showInvalidated'];

  sort = 'is-bestuurlijke-alias-van.gebruikte-voornaam';

  @tracked mandatenbeheer;
  @tracked mandatarisBestuursorganen;
  @tracked filter = '';
  @tracked page = 0;
  @tracked size = 10;
  @tracked vendorId = null;
  @tracked active = true;
  @tracked mandatarisActivePeriods;
  @tracked showInvalidated = false;
  @tracked mandatarisForInvalidation;
  @tracked invalidationType;

  get startDate() {
    return this.mandatenbeheer.startDate;
  }

  get endDate() {
    return this.mandatenbeheer.endDate;
  }

  get bestuursperioden() {
    return this.mandatenbeheer.bestuursperioden;
  }

  get bestuurseenheid() {
    return this.mandatenbeheer.bestuurseenheid;
  }

  get bestuursorganen() {
    return this.mandatenbeheer.bestuursorganen;
  }

  @restartableTask
  *search(searchData) {
    yield timeout(300);
    this.page = 0;
    this.filter = searchData;
  }

  @action
  selectVendor(vendorId) {
    this.page = 0;
    this.vendorId = vendorId;
  }

  @action
  toggleActive(checked) {
    this.page = 0;
    this.active = checked;
  }

  @action
  selectPeriod(period) {
    const queryParams = {
      page: 0,
      startDate: period.startDate,
    };

    queryParams['endDate'] = period.endDate;

    this.router.transitionTo('eredienst-mandatenbeheer.mandatarissen', {
      queryParams,
    });
  }

  @action
  handleInvalidationComplete() {
    this.hideInvalidationModal();
    this.router.refresh('eredienst-mandatenbeheer.mandatarissen');
  }

  @action
  softDelete(mandataris) {
    this.mandatarisForInvalidation = mandataris;
    this.invalidationType = INVALIDATION_REASON.INVALID;
  }

  @action
  markAsDuplicate(mandataris) {
    this.mandatarisForInvalidation = mandataris;
    this.invalidationType = INVALIDATION_REASON.DUPLICATE;
  }

  @action
  hideInvalidationModal() {
    this.mandatarisForInvalidation = null;
    this.invalidationType = null;
  }

  @action
  async revertInvalidation(mandataris) {
    const invalidation = mandataris.invalidation;
    await invalidation.destroyRecord();

    mandataris.invalidation = null;
    await mandataris.save();
  }
}
