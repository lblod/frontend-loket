import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { getAllWebsites } from 'frontend-loket/models/public-service';
import { getPublicServiceCta } from 'frontend-loket/utils/get-public-service-cta';

export default class SearchProductRoute extends Route {
  @service store;

  async model(params) {
    const publicService = await this.store.findRecord(
      'public-service',
      params.product_id,
      {
        include: 'websites,procedures.websites',
        reload: true,
      },
    );

    const primaryWebsite = await getPublicServiceCta(publicService);
    // We don't want to display the CTA link at the bottom, so we filter out any duplicates
    const otherWebsites = (await getAllWebsites(publicService)).filter(
      (website) => website.url !== primaryWebsite.url,
    );

    return {
      publicService,
      primaryWebsite,
      otherWebsites,
    };
  }
}
