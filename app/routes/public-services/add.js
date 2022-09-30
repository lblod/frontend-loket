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
      'page[number]': page,
    };

    if (search) {
      query['filter'] = search.trim();
    }

    if (sort) {
      query.sort = sort;
    }

    let conceptualPublicServices = yield this.store.query(
      'conceptual-public-service',
      query
    );

    let promises = [];
    conceptualPublicServices.forEach((service) => {
      promises.push(
        service.hasMany('targetAudiences').load(),
        service.hasMany('conceptTags').load(),
        service.hasMany('competentAuthorityLevels').load(),
        service.belongsTo('type').load()
      );
    });

    yield Promise.all(promises);

    return conceptualPublicServices;
  }
}
