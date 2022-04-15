import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PersoneelsbeheerPersoneelsaantallenLatestRoute extends Route {
  @service router;

  async model(params) {
    this.set('datasetId', params.dataset_id);
    const periods = await this.store.query('employee-period-slice', {
      page: { size: 1 },
      sort: '-time-period.start',
      'filter[dataset][id]': this.datasetId,
    });
    return periods.firstObject;
  }

  afterModel(model) {
    this.router.transitionTo(
      'personeelsbeheer.personeelsaantallen.periodes.edit',
      this.datasetId,
      model.id
    );
  }
}
