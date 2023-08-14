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
          },
          siteType: {
            label: 'Maatschappelijke zetel',
          },
        },
        {
          id: '352cc8e6-3a83-11ee-be56-0242ac120002',
          address: {
            fullAddress: 'Kerkakker 1, 8340 Damme, België',
          },
          siteType: {
            label: 'Gemeentehuis',
          },
        },
        {
          id: '352ccad0-3a83-11ee-be56-0242ac120002',
          address: {
            fullAddress: 'Werf 9, 9300 Aalst, België',
          },
          siteType: {
            label: 'Ander administratief adres',
          },
        },
        {
          id: '352ccc1a-3a83-11ee-be56-0242ac120002',
          address: {
            fullAddress: 'Grote Markt 1, 9300 Aalst, België',
          },
          siteType: {
            label: 'Gemeentehuis',
          },
        },
        {
          id: '352ccd5a-3a83-11ee-be56-0242ac120002',
          address: {
            fullAddress: 'Kerkakker 1, 9270 Laarne, België',
          },
          siteType: {
            label: 'Maatschappelijke zetel',
          },
        },
      ],
    };
    console.log('model', sites);
    return sites;
  }
}
