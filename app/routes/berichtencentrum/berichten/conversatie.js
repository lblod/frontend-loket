import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class BerichtencentrumBerichtenConversatieRoute extends Route {
  @service store;

  loadedRecords = new Set();

  model({ id }) {
    return this.store.findRecord('conversatie', id, {
      reload: this.shouldReload(id),
      include: 'berichten.van,berichten.auteur,berichten.bijlagen',
    });
  }

  // We force a reload if the record wasn't loaded here yet. This ensures all the sync relationships are loaded.
  // EmberData's caching strategy isn't flexible enough. It would instantly resolve the promise even if the relationships weren't loaded before.
  // There is probably a generic way to implement this in the adapter but this will do for now, especially with adapters and serializers being phased out.
  shouldReload(id) {
    const shouldReload = !this.loadedRecords.has(id);

    if (shouldReload) {
      this.loadedRecords.add(id);
    }

    return shouldReload;
  }
}
