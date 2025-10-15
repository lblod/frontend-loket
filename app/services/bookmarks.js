import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { warn } from '@ember/debug';

export default class BookmarksService extends Service {
  @service toaster;
  @service store;

  @tracked bookmarks = [];

  async load() {
    await this.fetchBookmarks();
  }

  async reset() {
    this.bookmarks = [];
  }

  async fetchBookmarks() {
    const response = await fetch('/bookmarks', {
      headers: { Accept: 'application/vnd.api+json' },
    });

    if (response.ok) {
      const { data } = await response.json();
      this.bookmarks = await Promise.all(
        data.map((bookmark) => this.jsonToBookmark(bookmark)),
      );
    } else {
      const error = await response.text();
      warn(`Failed to fetch bookmarks: [${response.status}] ${error}`, {
        id: 'bookmarks.failure',
      });
      this.reset();
    }
  }

  async bookmark(publicServiceId) {
    const response = await fetch(
      `/public-services/${publicServiceId}/bookmarks`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
      },
    );

    if (response.ok) {
      const { data } = await response.json();
      const bookmark = await this.jsonToBookmark(data);
      if (!this.bookmarks.some((b) => b.id == bookmark.id)) {
        this.bookmarks = [...this.bookmarks, bookmark];
      }
      return bookmark;
    } else {
      const error = await response.text();
      warn(`Failed to create bookmark: [${response.status}] ${error}`, {
        id: 'bookmarks.failure',
      });
      return null;
    }
  }

  async unbookmark(bookmarkId) {
    const bookmark = this.bookmarks.find((b) => b.id == bookmarkId);
    if (bookmark) {
      const response = await fetch(`/bookmarks/${bookmarkId}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/vnd.api+json',
        },
      });

      if (response.ok) {
        this.bookmarks = this.bookmarks.filter((b) => b != bookmark);
        this.toaster.notify(
          'is verwijderd uit jouw favorieten',
          `'${bookmark.object.name.default}'`,
          { timeOut: 5000 },
        );
      } else {
        this.toaster.error(
          'Probeer nogmaals',
          'Er liep iets mis bij het verwijderen van jouw favoriet',
          { timeOut: 5000 },
        );
        const error = await response.text();
        warn(`Failed to delete bookmark: [${response.status}] ${error}`, {
          id: 'bookmarks.failure',
        });
      }
    }
  }

  async jsonToBookmark(bookmark) {
    const products = await this.store.query('public-service', {
      'filter[:uri:]': bookmark.attributes.object,
      page: { size: 1 },
    });
    return {
      id: bookmark.id,
      uri: bookmark.attributes.uri,
      created: Date.parse(bookmark.attributes.created),
      modified: Date.parse(bookmark.attributes.modified),
      object: products[0],
    };
  }
}
