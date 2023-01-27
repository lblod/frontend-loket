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
    isReviewRequiredFilterEnabled: {
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
  *loadPublicServicesTask({
    search,
    page,
    sort,
    isReviewRequiredFilterEnabled,
  }) {
    let query = {
      'filter[created-by][:uri:]': this.currentSession.group.uri,
      'page[number]': page,
    };

    if (search) {
      query['filter'] = search.trim();
    }

    if (sort) {
      query.sort = sort;
    }

    if (isReviewRequiredFilterEnabled) {
      query['filter[:has:review-status]'] = true;
    }

    let publicServices = yield this.store.query('public-service', query);

    let promises = [];
    publicServices.forEach((service) => {
      promises.push(
        service.hasMany('targetAudiences').reload(),
        service.hasMany('executingAuthorityLevels').reload(),
        service.belongsTo('type').reload(),
        service.belongsTo('status').reload(),
        service.belongsTo('reviewStatus').reload()
      );
    });

    yield Promise.all(promises);

    return publicServices;
  }
}
