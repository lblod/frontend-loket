import { validatePresence } from 'ember-changeset-validations/validators';
import { validateConditionally } from '../validators/validate-conditionally';

export function getAddressValidations(isAlwaysRequired = false) {
  const REQUIRED_MESSAGE = 'Vul het volledige adres in';
  let isProvinceRequired = isAlwaysRequired; // Omg what is this?
  let addressValidation = {
    street: validatePresence({
      presence: true,
      ignoreBlank: true,
      message: REQUIRED_MESSAGE,
      on: isAlwaysRequired
        ? null
        : ['number', 'postcode', 'municipality', 'province', 'country'],
    }),
    number: validatePresence({
      presence: true,
      ignoreBlank: true,
      message: REQUIRED_MESSAGE,
      on: isAlwaysRequired
        ? null
        : ['street', 'postcode', 'municipality', 'province', 'country'],
    }),
    // TODO: Add format check
    postcode: validatePresence({
      presence: true,
      ignoreBlank: true,
      message: REQUIRED_MESSAGE,
      on: isAlwaysRequired
        ? null
        : ['street', 'number', 'municipality', 'province', 'country'],
    }),
    municipality: validatePresence({
      presence: true,
      ignoreBlank: true,
      message: REQUIRED_MESSAGE,
      on: isAlwaysRequired
        ? null
        : ['street', 'number', 'postcode', 'province', 'country'],
    }),
    country: validatePresence({
      presence: true,
      ignoreBlank: true,
      message: REQUIRED_MESSAGE,
      on: isAlwaysRequired
        ? null
        : ['street', 'number', 'postcode', 'municipality', 'province'],
    }),
  };

  if (isProvinceRequired) {
    addressValidation.province = validateConditionally(
      validatePresence({
        presence: true,
        ignoreBlank: true,
        message: REQUIRED_MESSAGE,
      }),

      function (changes, content) {
        return isCountryBelgium(changes, content);
      }
    );
  }

  return addressValidation;
}

function isCountryBelgium(changes, content) {
  let address = null;
  if (changes.country) {
    address = changes;
  } else {
    address = content;
  }

  return address.country === 'België';
}
