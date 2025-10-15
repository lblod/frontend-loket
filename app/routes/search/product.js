import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class SearchProductRoute extends Route {
  @service store;

  model(params) {
    return this.store.findRecord('public-service', params.product_id, {
      include: 'procedures.websites',
    });
  }
}
