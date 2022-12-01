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

      // Here it creates a new address even if the selector does have an address
      if (addresses.length == 0) {
        /* BUG: Steps to reproduce
        1) Select a person in the list from a new bedienaar
        2) Use the address selector to search for an address and select one
        3) newAdres is somehow empty when it's created (even if we await for the record)
        */
        console.log('adres (does have data)', adres);
        console.log(
          'adres arg (proxy) might be async/await relationship issue ?',
          this.args.contact.adres
        );
        console.log('createRecord but does not populate the adres model');
        newAdres = this.store.createRecord('adres', adres);
        console.log('it should contain data', newAdres);
      }
      this.args.contact.adres = newAdres || addresses.firstObject;
    } else {
      this.args.contact.adres = null;
    }

    // Updating a relationship value doesn't seem to clear the corresponding error messages, so we do it manually
    this.args.contact.errors.remove('adres');
  }
}
