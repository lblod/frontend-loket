import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PersoneelsbeheerPersoneelsaantallenPeriodesEditRoute extends Route {
  @service store;

  async model(params) {
    return this.store.query('employee-observation', {
      page: { size: 100 },
      'filter[slice][id]': params.period_id,
      include: [
        'unit-measure',
        'educational-level',
        'sex',
        'working-time-category',
        'legal-status',
        'slice',
      ].join(','),
    });
  }

  setupController(controller, model) {
    super.setupController(...arguments);
    const dataset = this.modelFor(
      'personeelsbeheer.personeelsaantallen.periodes'
    );
    controller.set('dataset', dataset);
  }
}
