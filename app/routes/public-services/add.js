import Route from '@ember/routing/route';
import { restartableTask, timeout } from 'ember-concurrency';
import {
  mockPublicServices,
  sectors,
} from 'frontend-loket/mock-data/public-services';

export default class PublicServicesAddRoute extends Route {
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
      sector = sectors.find((sector) => sector.id === params.sector);
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
