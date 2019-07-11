import Controller from '@ember/controller';
import { computed }  from '@ember/object';

const emptyAdresRegister = {
  land: null,
  gemeente: null,
  postcode: null,
  adres: null,
  adresRegisterId: null,
  adresRegisterUri: null
}

export default Controller.extend({
  newAddressData: null,
  showConfirmationDialog: false,

  isDirty: computed('model.hasDirtyAttributes', 'newAddress', function() {
    return this.model.hasDirtyAttributes || this.newAddressData;
  }),

  extractRelevantInfo(adresRegister) {
    return {
      land: null, //seriously no land?
      gemeente: adresRegister['gemeente']['gemeentenaam']['geografischeNaam']['spelling'],
      postcode: adresRegister['postinfo']['objectId'],
      volledigAdres: adresRegister['volledigAdres']['geografischeNaam']['spelling'],
      adresRegisterId: adresRegister['identificator']['objectId'],
      adresRegisterUri: adresRegister['identificator']['id']
    };
  },

  exit() {
    this.set('showConfirmationDialog', false);
    this.set('newAddressData', null);
    this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen', this.bestuursfunctie.id);
  },

  actions: {
    async save() {
      if (this.newAddressData) {
        // Match the selected address with the register and get its details
        let adresRegister = null;
        const matchResult = await fetch(`/adressenregister/match?municipality=${this.newAddressData.Municipality}&zipcode=${this.newAddressData.Zipcode}&thoroughfarename=${this.newAddressData.Thoroughfarename}&housenumber=${this.newAddressData.Housenumber}`);
        if (matchResult.ok) {
          const matchedAddress = await matchResult.json();
          if (matchedAddress) {
            const detailResult = await fetch(`/adressenregister/detail?uri=${matchedAddress.detail}`);
            if (detailResult.ok) {
              adresRegister = await detailResult.json();
              adresRegister = this.extractRelevantInfo(adresRegister);
            }
          }
        }

        let adres = await this.model.adres;
        if (adresRegister) {
          adres.setProperties(adresRegister);
        } else {
          adres.setProperties(emptyAdresRegister);
        }
        await adres.save();

        this.model.set('adres', adres);
        await this.model.save();

        this.exit();
      }
    },

    cancel(){
      if (!this.isDirty)
        this.exit();
      else
        this.set('showConfirmationDialog', true);
    },

    resetChanges() {
      this.model.rollbackAttributes();
      this.exit();
    },

    addressSelected(addressData){
      this.set('newAddressData', addressData);
    }
  }
});
