import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PublicServicesConceptDetailsRoute extends Route {
  @service store;

  async model({ conceptId }) {
    let concept = await this.store.findRecord(
      'conceptual-public-service',
      conceptId,
      {
        include: 'type,status,display-configuration',
      }
    );

    return {
      concept,
    };
  }
}
