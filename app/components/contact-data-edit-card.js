import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ContactDataEditCard extends Component {
  get isCountryBelgium() {
    return this.args.address.country == 'België';
  }

  @action
  updateCountry(value) {
    console.log('Update country', value);
    this.args.address.country = value;
    this.args.address.municipality = null;
    this.args.address.province = null;
  }

  @action
  automaticAddressSearchChanged(value) {
    console.log('Automatic address search changed', value);
  }
}
