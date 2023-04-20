import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hasConcept } from 'frontend-loket/models/public-service';
import { loadPublicServiceDetails } from 'frontend-loket/utils/public-services';

export default class PublicServicesLinkConceptRoute extends Route {
  @service router;
  @service store;

  async model({ serviceId }) {
    const publicService = await loadPublicServiceDetails(this.store, serviceId);

    if (hasConcept(publicService)) {
      return this.router.replaceWith(
        'public-services.details',
        publicService.id
      );
    }

    return {
      publicService,
    };
  }
}
