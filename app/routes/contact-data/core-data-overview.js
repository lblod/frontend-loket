import Route from '@ember/routing/route';

export default class CoreDataOverviewRoute extends Route {
  async model() {
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
      primaryContact: {
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

    const kbo = administrativeUnit.identifiers.find(
      (sub) => sub.idName === 'KBO nummer'
    ).structuredIdentifier.localId;
    const ovo = administrativeUnit.identifiers.find(
      (sub) => sub.idName === 'OVO-nummer'
    ).structuredIdentifier.localId;

    return { administrativeUnit, kbo, ovo };
  }
}
