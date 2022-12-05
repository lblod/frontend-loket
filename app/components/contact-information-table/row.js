import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

export default class ContactInformationTableRowComponent extends Component {
  @service store;

  @action
  async handleAdresChange(adres) {
    if (adres) {
      const addresses = await this.store.query('adres', {
        filter: {
          'adres-register-uri': adres.adresRegisterUri,
        },
      });

      let newAdres;
      if (addresses.length == 0) {
        newAdres = this.store.createRecord('adres', adres);
      }
      this.args.contact.adres = newAdres || addresses.firstObject;
    } else {
      this.args.contact.adres = null;
    }

    // Updating a relationship value doesn't seem to clear the corresponding error messages, so we do it manually
    this.args.contact.errors.remove('adres');
  }
}
