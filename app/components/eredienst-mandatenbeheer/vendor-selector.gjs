import { action } from '@ember/object';
import Component from '@glimmer/component';
import PowerSelect from 'ember-power-select/components/power-select';

export default class MandatenbeheerVendorSelectorComponent extends Component {
  @action
  selectVendor(vendor) {
    this.args.onSelect(vendor);
  }

  <template>
    <PowerSelect
      @placeholder="Bron"
      @options={{@options}}
      @selected={{@selectedVendor}}
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
