import Component from '@glimmer/component';
import { action } from '@ember/object';
import PowerSelect from 'ember-power-select/components/power-select';

const NO_PROVENANCE_VENDOR_ID = 'none';
const VANDEN_BROELE_VENDOR_ID = 'b1e41693-639a-4f61-92a9-5b9a3e0b924e';

export default class MandatenbeheerVendorSelectorComponent extends Component {
  // TODO: hardcoded for now, only one real vendor exists in production.
  // Once more vendors exist, fetch them from the API
  // (store.query('vendor', { page: { size: 100 }, sort: 'name' })) instead.
  vendorOptions = [
    { id: NO_PROVENANCE_VENDOR_ID, name: 'Loket lokale besturen' },
    { id: VANDEN_BROELE_VENDOR_ID, name: 'Vanden Broele' },
  ];

  get selectedVendor() {
    const vendorId = this.args.selectedVendor;
    if (!vendorId) return null;
    return this.vendorOptions.find((v) => v.id === vendorId);
  }

  @action
  selectVendor(vendor) {
    this.args.onSelect(vendor?.id);
  }

  <template>
    <PowerSelect
      @placeholder="Bron"
      @options={{this.vendorOptions}}
      @selected={{this.selectedVendor}}
      @onChange={{this.selectVendor}}
      @allowClear={{true}}
      @searchField="name"
      @triggerClass="au-u-1-1"
      as |vendor|
    >
      {{vendor.name}}
    </PowerSelect>
  </template>
}
