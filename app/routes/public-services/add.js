import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { restartableTask } from 'ember-concurrency';

export default class PublicServicesAddRoute extends Route {
  @service store;

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

  async model(params) {
    let sector;
    if (params.sector) {
      sector = await this.store.findRecord('concept', params.sector);
    }

    return {
      loadPublicServices: this.loadPublicServicesTask.perform(params),
      loadedPublicServices: this.loadPublicServicesTask.lastSuccessful?.value,
      sector,
    };
  }

  @restartableTask
  *loadPublicServicesTask({ search, sector, page, sort }) {
    let query = {
      'page[number]': page,
      include: 'sectors',
    };

    if (search) {
      query['filter'] = search.trim();
    }

    if (sort) {
      query.sort = sort;
    }

    if (sector) {
      query['filter[sectors][:id:]'] = sector;
    }

    return yield this.store.query('conceptual-public-service', query);
  }
}
