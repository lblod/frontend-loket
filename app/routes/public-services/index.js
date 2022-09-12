import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { restartableTask } from 'ember-concurrency';

export default class PublicServicesIndexRoute extends Route {
  @service store;
  @service currentSession;

  queryParams = {
    search: {
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
    return {
      loadPublicServices: this.loadPublicServicesTask.perform(params),
      loadedPublicServices: this.loadPublicServicesTask.lastSuccessful?.value,
    };
  }

  @restartableTask
  *loadPublicServicesTask({ search, page, sort }) {
    let query = {
      'filter[created-by][:uri:]': this.currentSession.group.uri,
      'page[number]': page,
      include: 'target-audiences,type,executing-authority-levels,status',
    };

    if (search) {
      query['filter'] = search.trim();
    }

    if (sort) {
      query.sort = sort;
    }
    return yield this.store.query('public-service', query);
  }
}
