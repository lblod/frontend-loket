import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class MandatenbeheerVendorSelectorComponent extends Component {
  @action
  selectVendor(vendor) {
    this.args.onSelect(vendor);
  }
}
