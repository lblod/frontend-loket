import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ContactDataEditCard extends Component {
  derp = 'HerpDerpDerpDerp';

  get isCountryBelgium() {
    return this.args.address.country == 'België';
  }

  @action
  updateCountry(value) {
    this.args.address.country = value;
    this.args.address.municipality = null;
    this.args.address.province = null;
  }
}
