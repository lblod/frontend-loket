import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { addedMockPublicServices } from 'frontend-loket/mock-data/public-services';

export default class PublicServicesDetailsRoute extends Route {
  @service router;

  model({ serviceId }) {
    let publicService = addedMockPublicServices.find(
      (publicService) => publicService.id === serviceId
    );

    // TODO: this only happens because state isn't persisted in the backend yet,
    // In the real implementation we would ideally use a 404 page instead.
    if (!publicService) {
      return this.router.replaceWith('public-services');
    }

    return {
      publicService,
    };
  }
}
