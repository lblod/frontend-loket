import Route from '@ember/routing/route';

export default class PersoneelsbeheerPersoneelsaantallenLatestRoute extends Route {
  async model(params) {
    this.set('datasetId', params.dataset_id);
    const periods = await this.store.query('employee-period-slice', {
      page: { size: 1 },
      sort: '-time-period.start',
      'filter[dataset][id]': this.datasetId
    });
    return periods.firstObject;
  }

  afterModel(model) {
    this.transitionTo('personeelsbeheer.personeelsaantallen.periodes.edit', this.datasetId, model.id);
  }
}
