import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class Favorite extends Component {
  @service('bookmarks') bookmarksService;

  get isBookmarked() {
    const productId = this.args.product.uuid || this.args.product.id;
    return this.bookmarksService.bookmarks.some(
      (b) => b.object?.id == productId,
    );
  }

  @action
  async toggleFavorite() {
    const productId = this.args.product.uuid || this.args.product.id;
    if (this.isBookmarked) {
      const bookmark = this.bookmarksService.bookmarks.find(
        (b) => b.object.id == productId,
      );
      await this.bookmarksService.unbookmark(bookmark.id);
    } else {
      await this.bookmarksService.bookmark(productId);
    }
  }
}
