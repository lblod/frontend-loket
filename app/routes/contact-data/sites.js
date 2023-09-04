import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ContactDataSitesRoute extends Route {
  @service store;

  async model() {
    const sites = {
      primarySite: {
        id: '352cc486-3a83-11ee-be56-0242ac120002',
      },
      sites: [
        {
          id: '352cc486-3a83-11ee-be56-0242ac120002',
          address: {
            fullAddress: 'Grote Markt 3, 9300 Aalst, België',
            province: 'Oost-Vlaanderen',
            municipality: 'Aalst',
          },
          siteType: {
            label: 'Maatschappelijke zetel',
          },
          contacts: [
            {
              type: 'Primary',
              telephone: '+32 475 50 99 00',
              email: 'da39a3ee5e6b4b0d3255bfef95601890afd80709@email.com',
              website: 'https://www.aalst.be/',
            },
          ],
        },
        {
          id: '352cc8e6-3a83-11ee-be56-0242ac120002',
          address: {
            fullAddress: 'Kerkakker 1, 8340 Damme, België',
            province: 'West-Vlaanderen',
            municipality: 'Damme',
          },
          siteType: {
            label: 'Gemeentehuis',
          },
          contacts: [],
        },
        {
          id: '352ccad0-3a83-11ee-be56-0242ac120002',
          address: {
            fullAddress: 'Werf 9, 9300 Aalst, België',
            province: 'Oost-Vlaanderen',
            municipality: 'Aalst',
          },
          siteType: {
            label: 'Ander administratief adres',
          },
          contacts: [
            {
              type: 'Primary',
              telephone: '+32 475 65 78 89',
              email: 'da39a3ee5e6b4b0d3255bfef95601890afd80709@email.com',
              website: 'https://www.aalst.be/',
            },
            {
              type: 'Secondary',
              telephone: '+32 3 877 78 11',
            },
          ],
        },
        {
          id: '352ccc1a-3a83-11ee-be56-0242ac120002',
          address: {
            fullAddress: 'Grote Markt 1, 9300 Aalst, België',
            province: 'Oost-Vlaanderen',
            municipality: 'Aalst',
          },
          siteType: {
            label: 'Gemeentehuis',
          },
          contacts: [
            {
              type: 'Primary',
              telephone: '+32 475 50 84 75',
              email: 'aalstgemeentehuis@email.com',
              website: 'https://www.aalst.be/',
            },
            {
              type: 'Secondary',
              telephone: '+32 473 34 55 64',
            },
          ],
        },
        {
          id: '352ccd5a-3a83-11ee-be56-0242ac120002',
          address: {
            fullAddress: 'Kerkakker 1, 9270 Laarne, België',
            province: 'Oost-Vlaanderen',
            municipality: 'Laarne',
          },
          siteType: {
            label: 'Maatschappelijke zetel',
          },
          contacts: [
            {
              type: 'Primary',
              telephone: '+32 9 365 46 00',
              email: 'kerkakker@vestiging.be',
              website: 'https://www.laarne.be/',
            },
          ],
        },
      ],
    };

    return sites;
  }
}
