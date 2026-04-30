import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { restartableTask, timeout } from 'ember-concurrency';
import { NO_PROVENANCE_VENDOR_ID } from 'frontend-loket/routes/eredienst-mandatenbeheer/mandatarissen';

export default class EredienstMandatenbeheerMandatarissenController extends Controller {
  @service() router;
  @service() currentSession;

  queryParams = ['vendorId'];

  sort = 'is-bestuurlijke-alias-van.gebruikte-voornaam';

  @tracked mandatenbeheer;
  @tracked filter = '';
  @tracked page = 0;
  @tracked size = 10;
  @tracked vendorId = null;

  // TODO: hardcoded for now, only one real vendor exists in production.
  // Once more vendors exist, fetch them from the API
  // (store.query('vendor', { page: { size: 100 }, sort: 'name' })) instead.
  vendorOptions = [
    { id: NO_PROVENANCE_VENDOR_ID, name: 'Loket lokale besturen' },
    { id: 'b1e41693-639a-4f61-92a9-5b9a3e0b924e', name: 'Vanden Broele' },
  ];

  get selectedVendor() {
    if (!this.vendorId) return null;
    return this.vendorOptions.find((v) => v.id === this.vendorId);
  }

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
  selectVendor(vendor) {
    this.page = 0;
    this.vendorId = vendor ? vendor.id : null;
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
}
