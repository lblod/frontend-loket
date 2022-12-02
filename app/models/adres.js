import Model, { attr } from '@ember-data/model';

export default class AdresModel extends Model {
  @attr busnummer;
  @attr huisnummer;
  @attr straatnaam;
  @attr postcode;
  @attr gemeentenaam;
  @attr land;
  @attr volledigAdres;
  @attr adresRegisterId;
  @attr adresRegisterUri;
}

export function combineFullAddress(address) {
  let fullStreet = `${address.straatnaam || ''} ${address.huisnummer || ''} ${
    address.busnummer || ''
  }`.trim();

  let muncipalityInformation = `${address.postcode || ''} ${
    address.gemeentenaam || ''
  }`.trim();

  if (fullStreet && muncipalityInformation) {
    return `${fullStreet}, ${muncipalityInformation}`;
  } else if (fullStreet) {
    return fullStreet;
  } else if (muncipalityInformation) {
    return muncipalityInformation;
  } else {
    return null;
  }
}

export async function isValidAdres(address) {
  const requiredFields = [
    'straatnaam',
    'huisnummer',
    'postcode',
    'gemeentenaam',
  ];

  requiredFields.forEach((field) => {
    let value = address[field];

    if (!(typeof value === 'string' && value.trim().length > 0)) {
      address.errors.add(field, `${field} is een vereist veld.`);
    }
  });

  return address.isValid;
}

export function resetAddressAttributes(address) {
  address.setProperties({
    busnummer: null,
    huisnummer: null,
    straatnaam: null,
    postcode: null,
    gemeentenaam: null,
    land: null,
    adresRegisterId: null,
    adresRegisterUri: null,
    volledigAdres: null,
  });
}

export function updateAddressAttributes(address) {
  return address.setProperties({
    busnummer: null,
    huisnummer: address.huisnummer,
    straatnaam: address.straatnaam,
    postcode: address.postcode,
    gemeentenaam: address.gemeentenaam,
    land: null,
    adresRegisterId: null,
    adresRegisterUri: null,
    volledigAdres: address.volledigAdres,
  });
}
