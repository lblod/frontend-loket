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
              telephone: '443567',
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
              telephone: '2f4b710606b804778715d4fd4608f82fa31b1aff',
              email: 'da39a3ee5e6b4b0d3255bfef95601890afd80709@email.com',
              website: 'https://www.aalst.be/',
            },
            {
              type: 'Secondary',
              telephone: 'da39a3ee5e6b4b0d3255bfef95601890afd80709',
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
              telephone: '56f5245fbf2a9b20bba17195a5a4299bb899687a',
              email: 'da39a3ee5e6b4b0d3255bfef95601890afd80709@email.com',
              website: 'https://www.aalst.be/',
            },
            {
              type: 'Secondary',
              telephone: 'da39a3ee5e6b4b0d3255bfef95601890afd80709',
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
        },
      ],
    };

    return sites;
  }
}
