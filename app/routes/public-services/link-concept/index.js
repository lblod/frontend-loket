import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { restartableTask } from 'ember-concurrency';

export default class PublicServicesLinkConceptIndexRoute extends Route {
  @service store;

  queryParams = {
    search: {
      refreshModel: true,
      replace: true,
    },
    isNewConcept: {
      refreshModel: true,
    },
    isInstantiated: {
      refreshModel: true,
    },
    page: {
      refreshModel: true,
    },
    sort: {
      refreshModel: true,
    },
  };

  async model(params) {
    const { publicService } = this.modelFor('public-services.link-concept');
    return {
      publicService,
      loadConcepts: this.loadConcepts.perform(params),
      loadedConcepts: this.loadConcepts.lastSuccessful?.value,
    };
  }

  @restartableTask
  *loadConcepts({ search, page, sort, isNewConcept, isInstantiated }) {
    let query = {
      'page[number]': page,
      include: 'display-configuration',
    };

    if (search) {
      query['filter'] = search.trim();
    }

    if (typeof isNewConcept === 'boolean') {
      query['filter[display-configuration][is-new-concept]'] = isNewConcept;
    }

    if (typeof isInstantiated === 'boolean') {
      query['filter[display-configuration][is-instantiated]'] = isInstantiated;
    }

    if (sort) {
      query.sort = sort;
    }

    let concepts = yield this.store.query('conceptual-public-service', query);

    let promises = [];
    concepts.forEach((concept) => {
      promises.push(
        concept.hasMany('targetAudiences').load(),
        concept.hasMany('conceptTags').load(),
        concept.hasMany('competentAuthorityLevels').load(),
        concept.belongsTo('type').load()
      );
    });

    yield Promise.all(promises);

    return concepts;
  }
}
