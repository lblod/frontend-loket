import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class ContactInformationTableRowComponent extends Component {
  @service store;

  @tracked newAdres;

  @action
  async handleAdresChange(adres) {
    if (adres) {
      const addresses = await this.store.query('adres', {
        filter: {
          'adres-register-uri': adres.adresRegisterUri,
        },
      });

      if (this.newAdres) {
        this.newAdres.rollbackAttributes();
        this.newAdres = undefined;
      }
      if (addresses.length == 0) {
        this.newAdres = this.store.createRecord('adres', adres);
      }

      this.args.contact.adres = this.newAdres || addresses.at(0);
    } else {
      this.args.contact.adres = null;
    }

    // Updating a relationship value doesn't seem to clear the corresponding error messages, so we do it manually
    this.args.contact.errors.remove('adres');
  }

  @action
  cancelEditing() {
    this.newAdres = null;
    this.args.onEditContactCancel();
  }
}
