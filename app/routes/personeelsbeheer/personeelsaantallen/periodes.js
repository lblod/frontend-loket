import Route from '@ember/routing/route';

export default class PersoneelsbeheerPersoneelsaantallenPeriodesRoute extends Route {
  model(params) {
    return this.store.find('employee-dataset', params.dataset_id);
  }
}
