import Service from '@ember/service';
import fetch from 'fetch';

class AddressSuggestion {
  constructor({ id, street, housenumber, zipCode, municipality, fullAddress }) {
    this.adresRegisterId = id;
    this.street = street;
    this.housenumber = housenumber;
    this.zipCode = zipCode;
    this.municipality = municipality;
    this.fullAddress = fullAddress;
  }

  isEmpty() {
    return (
      !this.adresRegisterId &&
      !this.street &&
      !this.housenumber &&
      !this.zipCode &&
      !this.municipality &&
      !this.fullAddress
    );
  }
}

class Address {
  constructor({
    adresRegisterId,
    uri,
    street,
    housenumber,
    busnumber,
    zipCode,
    municipality,
    fullAddress,
  }) {
    this.uri = uri;
    this.adresRegisterId = adresRegisterId;
    this.street = street;
    this.housenumber = housenumber;
    this.busnumber = busnumber;
    this.zipCode = zipCode;
    this.municipality = municipality;
    this.fullAddress = fullAddress;
  }

  get adresProperties() {
    return {
      straatnaam: this.street,
      huisnummer: this.housenumber,
      busnummer: this.busnumber,
      postcode: this.zipCode,
      gemeentenaam: this.municipality,
      land: null,
      volledigAdres: this.fullAddress,
      adresRegisterId: this.adresRegisterId,
      adresRegisterUri: this.uri,
    };
  }
}

export default class AddressregisterService extends Service {
  async suggest(query) {
    const results = await (
      await fetch(`/adressenregister/search?query=${query}`)
    ).json();
    return results.adressen.map(function (result) {
      return new AddressSuggestion({
        id: result.ID,
        street: result.Thoroughfarename,
        housenumber: result.Housenumber,
        zipCode: result.Zipcode,
        municipality: result.Municipality,
        fullAddress: result.FormattedAddress,
      });
    });
  }

  async findAll(suggestion) {
    let addresses = [];
    if (!suggestion.isEmpty()) {
      const results = await (
        await fetch(
          `/adressenregister/match?municipality=${suggestion.municipality}&zipcode=${suggestion.zipCode}&thoroughfarename=${suggestion.street}&housenumber=${suggestion.housenumber}`
        )
      ).json();
      addresses = results.map(function (result) {
        return new Address({
          uri: result.identificator.id,
          adresRegisterId: result.identificator.objectId,
          fullAddress: result.volledigAdres.geografischeNaam.spelling,
          street: suggestion.street,
          housenumber: suggestion.housenumber,
          busnumber: result.busnummer ? result.busnummer : null,
          zipCode: suggestion.zipCode,
          municipality: suggestion.municipality,
        });
      });
    }
    return addresses;
  }

  toAddressSuggestion(adresModel) {
    return new AddressSuggestion({
      adresRegisterId: adresModel.adresRegisterId,
      street: adresModel.straatnaam,
      housenumber: adresModel.huisnummer,
      zipCode: adresModel.postcode,
      municipality: adresModel.gemeentenaam,
      fullAddress: adresModel.volledigAdres,
    });
  }
}
