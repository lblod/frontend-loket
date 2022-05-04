import Route from '@ember/routing/route';
import { restartableTask, timeout } from 'ember-concurrency';
import { mockSectors } from 'frontend-loket/components/public-services/sector-select';

const TRANSLATION_STATUS = {
  PARTIALLY_TRANSLATED: { id: '1', label: 'Niet vertaalde velden' },
  TRANSLATED: { id: '2', label: 'Vertaald' },
};

const PUBLICATION_STATUS = {
  DRAFT: { id: '1', label: 'Ontwerp' },
  PUBLISHED: { id: '2', label: 'Gepubliceerd' },
};

// TODO: Retrieve the actual records from the backend
let mockPublicServices = [
  {
    id: '1',
    pid: '1923',
    name: 'Vestigingsvergunning nachtwinkels - phoneshops',
    sector: mockSectors[0],
    dateModified: new Date(2022, 1, 22, 15, 17),
    translationStatus: TRANSLATION_STATUS.PARTIALLY_TRANSLATED,
    publicationStatus: PUBLICATION_STATUS.DRAFT,
  },
  {
    id: '2',
    pid: '1932',
    name: 'Terrasvergunning - inname openbaar domein',
    sector: mockSectors[1],
    dateModified: new Date(2022, 1, 11, 11, 37),
    translationStatus: TRANSLATION_STATUS.TRANSLATED,
    publicationStatus: PUBLICATION_STATUS.PUBLISHED,
  },
];

export default class PublicServicesIndexRoute extends Route {
  queryParams = {
    search: {
      refreshModel: true,
      replace: true,
    },
    sector: {
      refreshModel: true,
      replace: true,
    },
    page: {
      refreshModel: true,
    },
    sort: {
      refreshModel: true,
    },
  };

  model(params) {
    let sector;
    if (params.sector) {
      sector = mockSectors.find((sector) => sector.id === params.sector);
    }

    return {
      loadPublicServices: this.loadPublicServicesTask.perform(params),
      loadedPublicServices: this.loadPublicServicesTask.lastSuccessful?.value,
      sector,
    };
  }

  @restartableTask
  *loadPublicServicesTask({ search, sector }) {
    yield timeout(1000);

    let publicServices = mockPublicServices;

    if (search) {
      publicServices = publicServices.filter((service) => {
        return (
          service.name.toLowerCase().includes(search.toLowerCase().trim()) ||
          service.pid.includes(search)
        );
      });
    }

    if (sector) {
      publicServices = publicServices.filter(
        (service) => service.sector.id === sector
      );
    }

    return publicServices;
  }
}
