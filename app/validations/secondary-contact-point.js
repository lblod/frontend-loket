import { validateFormat } from 'ember-changeset-validations/validators';

// Oscar. This may be redundant. We'll see.

export default {
  telephone: validateFormat({
    allowBlank: true,
    regex: /^\+?[0-9]*$/,
    message: 'Enkel een plusteken en cijfers zijn toegelaten',
  }),
};
