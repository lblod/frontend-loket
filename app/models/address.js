import Model, { attr, belongsTo } from '@ember-data/model';
/**
 * TODO: Merge this with 'adres'
 */

export default class AddressModel extends Model {
  @attr number;
  @attr boxNumber;
  @attr street;
  @attr postcode;
  @attr municipality;
  @attr province;
  @attr addressRegisterUri;
  @attr country;
  @attr fullAddress;

  @belongsTo('concept', {
    inverse: null,
  })
  source;
}

export function combineFullAddress(address) {
  let fullAddress = [];

  const fullStreet = `${address.street || ''} ${address.number || ''} ${
    address.boxNumber || ''
  }`.trim();

  if (fullStreet) fullAddress.push(fullStreet);

  const municipalityInformation = `
    ${address.postcode || ''} ${address.municipality || ''}
  `.trim();

  if (municipalityInformation) fullAddress.push(municipalityInformation);

  const countryInformation = `${address.country || ''}`;

  if (countryInformation) fullAddress.push(countryInformation);

  if (fullAddress.length) {
    return fullAddress.join(', ');
  } else {
    return null;
  }
}

export function createAddress(store) {
  let record = store.createRecord('address');
  return record;
}
