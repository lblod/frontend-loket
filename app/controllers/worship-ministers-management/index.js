import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { NO_PROVENANCE_VENDOR_ID } from 'frontend-loket/routes/eredienst-mandatenbeheer/mandatarissen';

export default class WorshipMinistersManagementIndexController extends Controller {
  @service currentSession;

  queryParams = ['vendorId'];

  @tracked sort = 'person.gebruikte-voornaam';
  @tracked page = 0;
  @tracked size = 20;
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

  @action
  selectVendor(vendor) {
    this.page = 0;
    this.vendorId = vendor ? vendor.id : null;
  }
}
