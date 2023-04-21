import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PublicServicesLinkConceptLinkRoute extends Route {
  @service router;
  @service store;

  model({ conceptId }) {
    // We intentionally don't return a promise here so the normal route template is rendered instantly and we don't see a white page before redirecting
    // This also allows us to show a breadcrumb since our current breadcrumb setup doesn't support loading states
    this.linkPublicServiceToConcept(conceptId);
  }

  async linkPublicServiceToConcept(conceptId) {
    const concept = await this.store.findRecord(
      'conceptual-public-service',
      conceptId
    );
    const { publicService } = this.modelFor('public-services.link-concept');

    publicService.concept = concept;
    await publicService.save();

    this.router.replaceWith('public-services.details', publicService.id);
  }
}
