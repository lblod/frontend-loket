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
      address.errors.add(field, 'Dit veld is verplicht.');
    }
  });

  return address.isValid;
}
