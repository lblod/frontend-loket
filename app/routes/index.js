import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { compare } from '@ember/utils';
import isFeatureEnabled from 'frontend-loket/helpers/is-feature-enabled';
import { getPublicServiceCta } from '../utils/get-public-service-cta';

class IndexRoute extends Route {
  @service currentSession;
  @service session;
  @service router;

  async beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }
}

class NewLoketIndexRoute extends Route {
  @service('bookmarks') bookmarksService;
  @service session;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  model() {
    const favorites = this.bookmarksService.bookmarks
      .map((bookmark) => bookmark.object)
      .sort((a, b) => compare(a.name.default, b.name.default));
    return Promise.all(
      favorites.map(async (product) => {
        const callToAction = await getPublicServiceCta(product);
        return { product, website: callToAction };
      }),
    );
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.searchTerm = null;
    controller.selectedProduct = null;
  }
}

const RouteClass = isFeatureEnabled('new-loket')
  ? NewLoketIndexRoute
  : IndexRoute;

export default RouteClass;
