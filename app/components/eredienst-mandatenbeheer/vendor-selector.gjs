import Component from '@glimmer/component';
import { action } from '@ember/object';
import PowerSelect from 'ember-power-select/components/power-select';
import { service } from '@ember/service';
import {
  NO_PROVENANCE_VENDOR_ID,
  ALL_VENDORS_ID,
} from 'frontend-loket/models/vendor';

export default class VendorSelector extends Component {
  @service currentSession;

  get vendorOptions() {
    const userVendors = this.currentSession.vendors;

    return [
      { id: NO_PROVENANCE_VENDOR_ID, name: 'Loket lokale besturen' },
      ...userVendors.map((vendor) => {
        return { id: vendor.id, name: vendor.name };
      }),
    ];
  }

  get selectedVendor() {
    const vendorId = this.args.selectedVendor;
    if (!vendorId || vendorId === ALL_VENDORS_ID) return null;
    return this.vendorOptions.find((v) => v.id === vendorId);
  }

  @action
  selectVendor(vendor) {
    const vendorId = vendor ? vendor.id : 'all';
    this.args.onSelect(vendorId);
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
