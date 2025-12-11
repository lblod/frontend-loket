import { action } from '@ember/object';
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
  @service toaster;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  async model() {
    let errorLoadingFavorite = false;
    let favoritesData = [];

    try {
      const favorites = this.bookmarksService.bookmarks
        .map((bookmark) => bookmark.object)
            .sort((a, b) => compare(a.name.default, b.name.default));


      favoritesData = await Promise.all(
        favorites.map(async (product) => {
          try {
            const callToAction = await getPublicServiceCta(product);
            return { product, website: callToAction };
          }
          catch(err) {
            console.error(err);
            errorLoadingFavorite = true;
            return {}
          }
        }),
      );
    }
    catch(err) {
      console.error(err);
      errorLoadingFavorite = true;
    }

    if(errorLoadingFavorite) {
      const errorMsg = `
        U kan het product of de dienst
          proberen terug te vinden via de reguliere zoekfunctie.
        Gelieve de helpdesk te contacteren
          indien u blijvende hinder ondervindt.
      `;
      const errorTitle = `Probleem bij
       het ophalen van minstens één favoriet.`;

      this.toaster.error(errorMsg, errorTitle);
    }

    return favoritesData;
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.searchTerm = null;
    controller.selectedProduct = null;
  }

  @action
  loading() {
    // We don't want the loading substate for this route.
    return false;
  }
}

const RouteClass = isFeatureEnabled('new-loket')
  ? NewLoketIndexRoute
  : IndexRoute;

export default RouteClass;
