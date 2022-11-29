import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

export default class ContactInformationTableInputManualAddressComponent extends Component {
  @service store;

  constructor() {
    super(...arguments);
  }
}
