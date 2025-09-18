import Route from '@ember/routing/route';
import { compare } from '@ember/utils';
import { service } from '@ember/service';

export default class FavoritesRoute extends Route {
  @service('bookmarks') bookmarksService;
  @service session;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  model() {
    return this.bookmarksService.bookmarks
      .map((bookmark) => bookmark.object)
      .sort((a, b) => compare(a.name.default, b.name.default));
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.selectedProduct = null;
  }
}
