import { isBlank } from '@ember/utils';
import { validatePresence } from 'ember-changeset-validations/validators';
// import { ID_NAME } from '../models/identifier';

export default {
  name: validatePresence({
    presence: true,
    ignoreBlank: true,
    message: 'Vul de naam in',
  }),

  classification: validatePresence({
    presence: true,
    ignoreBlank: true,
    message: 'Selecteer een optie',
  }),

  organizationStatus: validatePresence({
    presence: true,
    ignoreBlank: true,
    message: 'Selecteer een optie',
  }),
};

// TODO: Add store as parameter when we have a store containing administrative units
export function getStructuredIdentifierKBOValidations() {
  return {
    localId: validateKBO(),
  };
}

function validateKBO() {
  return async (key, newKboNumber, currentKboNumber) => {
    if (isBlank(newKboNumber)) {
      return true;
    }

    if (newKboNumber.match(/[^$,.\d]/) || newKboNumber.length !== 10) {
      return {
        message: 'Vul het (tiencijferige) KBO nummer in.',
      };
    }

    if (newKboNumber === currentKboNumber) {
      return true;
    }
    // TODO: This old code might work if there is a store with an administrative unit in it
    // let records = await store.query('administrative-unit', {
    //   filter: {
    //     identifiers: {
    //       ':exact:id-name': ID_NAME.KBO,
    //       'structured-identifier': {
    //         ':exact:local-id': newKboNumber,
    //       },
    //     },
    //   },
    //   include: 'identifiers.structured-identifier',
    // });

    // if (records.length === 0) {
    //   return true;
    // }

    // TODO: update this when we have a store with administrative units
    // ember-changeset-validations doesn't support adding metadata to error messages
    // returning an object here seems to work so we use that as a workaround / hack
    return {
      message:
        'Mochten we administrative units kennen dan zou ik meer informatie hebben...',
      meta: {
        derp: true,
      },
    };
  };
}
