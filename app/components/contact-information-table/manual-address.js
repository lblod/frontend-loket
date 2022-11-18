import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

const requiredFields = ['straat', 'huisnummer', 'postcode', 'gemeentenaam'];

export default class ContactInformationTableManualAddressComponent extends Component {
  @service store;

  constructor() {
    super(...arguments);
    console.log(this.args);
  }
  // we check when the input has value, if true remove error message;
  @action
  checkForEmptyFields() {
    requiredFields.forEach((field) => {
      let value = this.args.address[field];
      if (!(typeof value === 'string' && value.trim().length > 0)) {
        this.args.address.errors.add(field, `${field} is een vereist veld.`);
      }
    });
  }

  @action
  // errors = this.adress.errors
  handleFieldErrors(errors) {
    switch (errors) {
      case !errors.straat:
        errors.remove('straat');
        break;
      case !errors.huisnummer:
        errors.remove('huisnummer');
        break;
      case !errors.postcode:
        errors.remove('postcode');
        break;
      case !errors.gemeentenaam:
        errors.remove('gemeentenaam');
        break;
      default:
        break;
    }
  }
}
