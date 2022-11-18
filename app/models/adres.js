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

export async function isValidAdres(address) {
  const requiredFields = ['straat', 'huisnummer', 'postcode', 'gemeentenaam'];

  requiredFields.forEach((field) => {
    let value = address[field];

    if (!(typeof value === 'string' && value.trim().length > 0)) {
      address.errors.add(field, `${field} is een vereist veld.`);
    }
  });

  return address.isValid;
}
