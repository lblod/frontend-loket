import { validatePresence } from 'ember-changeset-validations/validators';

export function getSiteValidations() {
  let siteValidation = {
    siteType: validatePresence({
      presence: true,
      ignoreBlank: true,
      message: 'Voeg een type vestiging toe',
    }),
  };
  return siteValidation;
}
