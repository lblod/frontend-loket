import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { loadPublicServiceDetails } from 'frontend-loket/utils/public-services';

export default class PublicServicesDetailsRoute extends Route {
  @service store;

  async model({ serviceId }) {
    let publicService = await loadPublicServiceDetails(this.store, serviceId);

    return {
      publicService,
    };
  }
}
