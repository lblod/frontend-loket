import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

const hardcodedAdministrativeUnitDataForDemo = {
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
    contacts: [
      {
        telephone: '081000000',
        email: 'fakeemail@gmail.com',
        website: 'https://google.com',
      },
      {
        telephone: '081000002',
        email: 'fakeemail2@gmail.com',
        website: 'https://wikipedia.org',
      },
    ],
  },
};

export default class CoreDataOverviewRoute extends Route {
  @service store;

  async model() {
    // This is demo code with a hardcoded record
    // Normally this should be an ember model
    const administrativeUnitRecord = hardcodedAdministrativeUnitDataForDemo;

    const address = administrativeUnitRecord.primarySite.address;

    const kbo = administrativeUnitRecord.identifiers.find(
      (sub) => sub.idName === 'KBO nummer'
    ).structuredIdentifier.localId;
    const ovo = administrativeUnitRecord.identifiers.find(
      (sub) => sub.idName === 'OVO-nummer'
    ).structuredIdentifier.localId;

    return {
      administrativeUnit: administrativeUnitRecord,
      kbo,
      ovo,
      address,
      primaryContact: administrativeUnitRecord.primarySite.contacts[0],
      secondaryContact: administrativeUnitRecord.primarySite.contacts[1],
    };
  }
}
