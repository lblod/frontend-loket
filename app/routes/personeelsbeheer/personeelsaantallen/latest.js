import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PersoneelsbeheerPersoneelsaantallenLatestRoute extends Route {
  @service router;
  @service store;

  async model({ dataset_id: datasetId }, transition) {
    transition.data.datasetId = datasetId;

    const periods = await this.store.query('employee-period-slice', {
      page: { size: 1 },
      sort: '-time-period.start',
      'filter[dataset][id]': datasetId,
    });
    return periods.firstObject;
  }

  afterModel(model, transition) {
    this.router.transitionTo(
      'personeelsbeheer.personeelsaantallen.periodes.edit',
      transition.data.datasetId,
      model.id
    );
  }
}
