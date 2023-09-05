import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { createValidatedChangeset } from '../../utils/changeset';
import { getAddressValidations } from 'frontend-loket/validations/address';
import contactValidations from 'frontend-loket/validations/contact-point';
import secondaryContactValidations from 'frontend-loket/validations/secondary-contact-point';

export default class CoreDataEditRoute extends Route {
  @service currentSession;

  // TODO: Add check beforeModel to test if canEdit is true
  // beforeModel() {
  //   if (!this.currentSession.canEdit) {
  //     this.router.transitionTo('route-not-found', {
  //       wildcard: 'pagina-niet-gevonden',
  //     });
  //   }
  // }

  // TODO: Get from store
  async model() {
    // TODO: Get this from store
    const administrativeUnit = {
      name: 'Aalst',
      classification: {
        label: 'OCMW',
      },
      organizationStatus: {
        id: '63cc561de9188d64ba5840a42ae8f0d6',
        label: 'Actief',
      },
      identifiers: [
        {
          idName: 'KBO nummer',
          structuredIdentifier: {
            localId: '0212.237.186',
          },
        },
        {
          idName: 'SharePoint identificator',
          structuredIdentifier: {
            localId: '324',
          },
        },
        {
          idName: 'OVO-nummer',
          structuredIdentifier: {
            localId: 'OVO002601',
          },
        },
      ],
      primarySite: {
        address: {
          fullAddress: 'Gasthuisstraat 40, 9300 Aalst, België',
          province: 'Oost-Vlaanderen',
        },
      },
      contact: {
        telephone: '081 00 0000',
        email: 'fakeemail@gmail.com',
        website: 'https://google.com',
      },
      secondaryContact: {
        telephone: '081 00 0002',
        email: 'fakeemail2@gmail.com',
        website: 'https://wikipedia.org',
      },
    };
    // Todo: extract from model, the notations are taken from loket
    let address = administrativeUnit.primarySite.address;
    let contact = administrativeUnit.contact;
    let secondaryContact = administrativeUnit.secondaryContact;
    return {
      address: createValidatedChangeset(address, getAddressValidations()),
      contact: createValidatedChangeset(contact, contactValidations),
      secondaryContact: createValidatedChangeset(
        secondaryContact,
        secondaryContactValidations
      ),
      administrativeUnit,
    };
  }
}
