/* eslint-disable prettier/prettier */
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';


/*
type ContactDataEditFormResult = { address: Address, primary: ContactPunt, seconday: ContactPunt, isValid: boolean }
*/


/**
 * Component to edit contact data. Used initially in core data edit and in site data edit pages
 * Parameters:
 * initialAddress: model address | undefined;
 * initialPrimaryContactPunt: model contact punt | undefined
 * initialSeconaryContactPunt: model contact punt | undefined
 *
 * onChange: () => ContactDataEditFormResult | undefined
 */
export default class ContactDataEditFormComponent extends Component {
  constructor(...args) {
    super(...args);

  }

  @tracked
  _formData = {
    address: {},
    primary: {},
    secondary: {},
  }

  /** @type {'automatic' | 'manual'} */
  addressInputMode = 'automatic';

  // selectedAutomaticAddress = (() => {
  //   if (this._formData.address.volledigAdres)
  //     return this.args.initialAddress.volledigAdres;
  //   return `${this.args.initialAddress.straatNaam} ${this.args.initialAddress.huisnummer}\n${this.args.initialAddress.postcode} ${this.args.initialAddress.gemeenteNaam}`;
  // })();

  automaticAddressOptions = [];
  selectMunicipalityOptions = ['Kerkeghem'];
  selectProvincieOptions = [
    'West-Vlaanderen',
    'Oost-Vlaanderen',
    'Vlaams-Brabant',
    'Antwerpen',
    'Limburg'
  ]

  postcodeMaskOptions = {
    mask: '9999',
    placeholder: '0000',
  };

  phoneNumberMaskOptions = {
    placeholder: '+32 400 10 20 30',
  };

  emailMaskOptions = {
    placeholder: 'naam.achternaam@provider.be',
  };

  websiteMaskOptions = {
    placeholder: 'www.website.be',
  };
  // Validation ember-change?
  // Validating phone numbers? Just regex numbers and spaces and +


  computeResult() {
    this._formData.address.isValid = true;
    this._formData.volledigAdres = `${this._formData.address.straatNaam} ${this._formData.address.huisnummer}\n${this._formData.address.postcode} ${this._formData.address.gemeenteNaam}`;
    return this._formData;
  }

  addressInputEventHandler(fieldName) {
    return (event) => {
      if (!this._formData) return;
      event.preventDefault();
      this._formData.address[fieldName] = event.target.value;
      this.args.onChange(this.computeResult());
    };
  }

  contactInputEventHandler(fieldName, order) {
    return (event) => {
      event.preventDefault();
      switch (order) {
        case 'primary': this._formData.primary[fieldName] = event.target.value; break;
        case 'secondary': this._formData.secondary[fieldName] = event.target.value; break;
        default: throw new Error('Second argument needs to equal primary or secondary');
      }
      this.args.onChange(this.computeResult());
    };
  }

  @action
  automaticAddressSearchChanged(...args) {
    console.log('automaticAddressSearchChanged', args);
  }

  @action
  handleManualStreetControl(event) {
    this.addressInputEventHandler('straatnaam')(event);
  }
  @action
  handleManualHousenumberControl(event) {
    this.addressInputEventHandler('huisnummer')(event);
  }
  @action
  handleManualPostcodeControl(event) {
    this.addressInputEventHandler('postcode')(event);
  }
  @action
  handleManualBusnumberControl(event) {
    this.addressInputEventHandler('busnummer')(event);
  }
  @action
  handleManualMunicipalityControl(municipality) {
    this._formData.address.gemeentenaam = municipality;
    this.args.onChange(this.computeResult());
  }
  @action
  handleManualProvinceControl(province) {

    this._formData.address.provincie = province;
    this.args.onChange(this.computeResult());
  }
  @action
  handlePrimaryPhoneControl(event) {
    this.contactInputEventHandler('telefoon','primary')(event);
  }
  @action
  handleSecondaryPhoneControl(event) {
    this.contactInputEventHandler('telefoon','secondary')(event);
  }
  @action
  handleEmailControl(event) {
    this.contactInputEventHandler('email','primary')(event);
  }
  @action
  handleWebsiteControl(event) {
    this.contactInputEventHandler('website','primary')(event);
  }

}
