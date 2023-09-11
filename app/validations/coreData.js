import {
  validatePresence,
  validateFormat,
} from 'ember-changeset-validations/validators';

const REQUIRED_MESSAGE = 'Dit is een verplicht veld';

const coreDataValidations = {
  name: [
    validatePresence({
      presence: true,
      ignoreBlank: true,
      message: REQUIRED_MESSAGE,
    }),
    validateFormat({
      regex: /^([0-9]|[a-z]|[A-Z]|-| |\.)*$/,
      message:
        'Naam mag enkel alphanumerieke karakters bevatten, punten en koppeltekens.',
    }),
  ],
  adminType: validatePresence({
    presence: true,
    ignoreBlank: true,
    message: REQUIRED_MESSAGE,
  }),
  region: validatePresence({
    presence: true,
    ignoreBlank: true,
    message: REQUIRED_MESSAGE,
  }),
  status: validatePresence({
    presence: true,
    ignoreBlank: true,
    message: REQUIRED_MESSAGE,
  }),
  kbo: [
    validatePresence({
      presence: true,
      ignoreBlank: true,
      message: REQUIRED_MESSAGE,
    }),
    validateFormat({
      regex: /^[01][0-9]{3}\.[0-9]{3}\.[0-9]{3}$/,
      message: 'KBO nummer moet formaat hebben XXXX.XXX.XXX',
    }),
  ],
  nis: validatePresence({
    presence: true,
    ignoreBlank: true,
    message: REQUIRED_MESSAGE,
  }),
  ovo: validatePresence({
    presence: true,
    ignoreBlank: true,
    message: REQUIRED_MESSAGE,
  }),
};

export default coreDataValidations;
