import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PublicServicesDetailsRoute extends Route {
  @service store;

  async model({ serviceId }) {
    let publicService = await this.store.findRecord(
      'public-service',
      serviceId,
      { reload: true, include: 'type,status' }
    );

    return {
      publicService,
    };
  }
}
